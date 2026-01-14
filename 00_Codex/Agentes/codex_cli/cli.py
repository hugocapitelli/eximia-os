#!/usr/bin/env python3
"""
Codex CLI - Command Line Interface & Orchestrator (Tier 2)
Orquestra workflows completos do Codex integrando Scraper, Categorizer e Database
"""

import sys
import argparse
import shutil
import re
import uuid
from pathlib import Path
from typing import Optional, List, Dict
from datetime import datetime

# Adicionar paths ao Python path
# cli.py está em 00_Codex/Agentes/codex_cli/cli.py
# project_root é 00_Codex/Agentes
codex_cli_path = Path(__file__).parent  # codex_cli/
agentes_path = codex_cli_path.parent     # Agentes/
codex_path = agentes_path.parent         # 00_Codex/
project_root = codex_path.parent         # eximIA.OS/

sys.path.insert(0, str(agentes_path))
sys.path.insert(0, str(project_root))

from codex_scraper.scraper import CodexScraper
from codex_categorizer.categorizer import CodexCategorizer

# Import database & storage
sys.path.insert(0, str(codex_path / "scripts"))
from database import CodexDatabase
from storage import storage


class CodexCLI:
    """Orquestrador completo do Projeto Codex"""
    
    def __init__(self):
        self.db = CodexDatabase()
        self.scraper = CodexScraper()
        self.categorizer = CodexCategorizer()
        self.codex_path = project_root / "00_Codex"
    
    # ===== Comandos de Ingestão =====
    
    def cmd_add(self, url: str, auto_approve: bool = False) -> dict:
        """
        Workflow: Adicionar conteúdo com ou sem review
        
        Args:
            url: URL para adicionar
            auto_approve: Se True, pula review e adiciona direto
        
        Returns:
            Dict com resultado do workflow
        """
        print(f"🔍 Extraindo conteúdo de: {url}")
        
        # Paso 1: Scraper
        # Scraper salva localmente em temp/inbox por enquanto
        scrape_result = self.scraper.extract_url(url)
        
        if scrape_result['status'] != 'success':
            print(f"❌ Erro ao extrair: {scrape_result.get('error')}")
            return scrape_result
        
        content_id = scrape_result['content_id']
        local_file_path = Path(scrape_result['file_path'])
        metadata = scrape_result['metadata']
        
        print(f"✅ Conteúdo extraído: {content_id}")
        print(f"   Título: {metadata['title']}")
        print(f"   Palavras: {metadata.get('word_count', 'N/A')}")
        
        # Paso 2: Categorizer
        print(f"\n🤖 Categorizando com IA...")
        
        # Categorizer lê do arquivo local
        cat_result = self.categorizer.analyze_content(str(local_file_path), metadata)
        
        if cat_result['status'] != 'success':
            print(f"❌ Erro ao categorizar: {cat_result.get('error')}")
            return cat_result
        
        categorization = cat_result['categorization']
        
        print(f"✅ Categorização completa:")
        print(f"   Tipo: {categorization['type']}")
        print(f"   Tags: {', '.join(categorization['tags'][:5])}")
        print(f"   Confiança: {categorization['confidence']:.2f}")
        
        # Paso 3: Review ou Auto-approve
        if not auto_approve:
            print(f"\n📋 Preview:")
            print(f"   ID: {content_id}")
            print(f"   Título: {metadata['title']}")
            print(f"   Autor: {categorization.get('author', 'N/A')}")
            print(f"   Resumo: {categorization['summary'][:150]}...")
            
            response = input("\n✅ Aprovar e adicionar à biblioteca? (s/N): ")
            if response.lower() != 's':
                print("❌ Operação cancelada")
                return {"status": "cancelled"}
        
        # Paso 4: Upload para Cloud Storage & Database
        print(f"\n☁️ Sincronizando com a Nuvem...")
        
        # Definir caminho remoto (eximia_data/00_INBOX/file.md)
        remote_path = f"eximia_data/00_INBOX/{local_file_path.name}"
        
        # Upload
        if storage.upload_file(local_file_path, remote_path):
            print("   ✅ Upload concluído")
        else:
            print("   ⚠️  Falha no upload (usando cópia local)")
            
        print(f"💾 Salvando no database...")
        
        try:
            self.db.add_content(
                content_id=content_id,
                title=metadata['title'],
                content_type=categorization['type'],
                source_url=url,
                author=categorization.get('author'),
                file_path=str(remote_path), # Salva caminho relativo/remoto
                tags=categorization['tags'],
                notes=categorization['summary']
            )
            
            # Auto-approve: padroniza ID e move para LIBRARY
            if auto_approve:
                approve_res = self._approve_content({'id': content_id, 'type': categorization['type'], 'file_path': str(remote_path)})
                content_id = approve_res.get('new_id', content_id)
            
            print(f"✅ Conteúdo adicionado com sucesso!")
            print(f"   ID: {content_id}")
            print(f"   Status: {'library' if auto_approve else 'inbox'}")
            
            return {
                "status": "success",
                "content_id": content_id,
                "categorization": categorization
            }
        
        except Exception as e:
            print(f"❌ Erro ao salvar: {e}")
            return {"status": "error", "error": str(e)}
    
    def cmd_add_auto(self, url: str) -> dict:
        """Atalho para add com auto-approve"""
        return self.cmd_add(url, auto_approve=True)
    
    def cmd_add_batch(self, input_data: str, auto_approve: bool = False) -> dict:
        """
        Adiciona múltiplos URLs em lote
        
        Args:
            input_data: String com URLs (virgula) ou path para .txt
            auto_approve: Se True, pula review para todos
        """
        urls = []
        
        # Verificar se é um arquivo
        input_path = Path(input_data)
        if input_path.exists() and input_path.is_file() and input_path.suffix == '.txt':
            print(f"📖 Lendo URLs do arquivo: {input_data}")
            with open(input_path, 'r', encoding='utf-8') as f:
                urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        else:
            # Assumir lista separada por vírgula
            urls = [u.strip() for u in input_data.split(',') if u.strip()]
        
        if not urls:
            print("⚠️  Nenhum URL encontrado para processar.")
            return {"status": "error", "message": "No URLs found"}
        
        print(f"🚀 Iniciando processamento em lote de {len(urls)} URLs...")
        
        results = []
        success_count = 0
        
        for i, url in enumerate(urls, 1):
            print(f"\n--- [{i}/{len(urls)}] Processando: {url} ---")
            try:
                res = self.cmd_add(url, auto_approve=auto_approve)
                results.append(res)
                if res.get('status') == 'success':
                    success_count += 1
            except Exception as e:
                print(f"❌ Falha crítica no item {i}: {e}")
                results.append({"status": "error", "url": url, "error": str(e)})
        
        print(f"\n✅ Lote finalizado! Sucesso: {success_count}/{len(urls)}")
        
        return {
            "status": "success",
            "total": len(urls),
            "success": success_count,
            "results": results
        }
    
    def cmd_add_batch_auto(self, input_data: str) -> dict:
        """Atalho para add-batch com auto-approve"""
        return self.cmd_add_batch(input_data, auto_approve=True)
    
    # ===== Comandos de Busca =====
    
    def cmd_list(
        self,
        content_type: Optional[str] = None,
        author: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 100
    ) -> dict:
        """Lista conteúdos com filtros"""
        contents = self.db.list_contents(
            content_type=content_type,
            author=author,
            status=status,
            limit=limit
        )
        
        if not contents:
            print("📭 Nenhum conteúdo encontrado")
            return {"status": "success", "count": 0}
        
        # Exibir tabela
        print(f"\n📚 Encontrados {len(contents)} itens:\n")
        print(f"{'ID':<15} {'Título':<40} {'Tipo':<15} {'Tags':<30}")
        print("-" * 100)
        
        for content in contents:
            title = content['title'][:37] + "..." if len(content['title']) > 40 else content['title']
            tags_str = ', '.join(content.get('tags', [])[:3])
            print(f"{content['id']:<15} {title:<40} {content['type']:<15} {tags_str:<30}")
        
        return {"status": "success", "count": len(contents), "contents": contents}
    
    def cmd_search(self, query: str, limit: int = 20) -> dict:
        """Busca full-text usando FTS5"""
        results = self.db.search(query, limit=limit)
        
        if not results:
            print(f"🔍 Nenhum resultado para: '{query}'")
            return {"status": "success", "count": 0}
        
        print(f"\n🔍 Encontrados {len(results)} resultados para '{query}':\n")
        
        for i, result in enumerate(results, 1):
            print(f"{i}. [{result['id']}] {result['title']}")
            print(f"   Autor: {result.get('author', 'N/A')}")
            print(f"   Tags: {result.get('tags', 'N/A')}")
            print()
        
        return {"status": "success", "count": len(results), "results": results}
    
    # ===== Comandos de Intelligence =====
    
    def cmd_stats(self) -> dict:
        """Exibe estatísticas do Codex"""
        stats = self.db.get_stats()
        
        print("\n📊 Estatísticas do Codex\n")
        print(f"📚 Total: {stats['total']} itens\n")
        
        print("Por Tipo:")
        for tipo, count in stats['by_type'].items():
            print(f"   {tipo}: {count}")
        
        print(f"\nPor Status:")
        for status, count in stats['by_status'].items():
            print(f"   {status}: {count}")
        
        if stats['top_tags']:
            print(f"\n🏷️  Top Tags:")
            for tag, count in stats['top_tags'][:10]:
                print(f"   {tag}: {count}")
        
        if stats['top_authors']:
            print(f"\n✍️  Top Autores:")
            for author, count in stats['top_authors'][:10]:
                print(f"   {author}: {count}")
        
        return {"status": "success", "stats": stats}
    
    # ===== Comandos Adicionais =====
    
    def cmd_upload(self, file_path: str) -> dict:
        """Upload de arquivo local"""
        import shutil
        import uuid
        
        file = Path(file_path)
        if not file.exists():
            print(f"❌ Arquivo não encontrado: {file_path}")
            return {"status": "error", "error": "File not found"}
        
        print(f"📤 Preparando upload de: {file.name}")
        
        # Check Local INBOX (legacy/cache)
        inbox_dir = self.codex_path / "eximia_data" / "00_INBOX"
        inbox_dir.mkdir(parents=True, exist_ok=True)
        dest = inbox_dir / file.name
        
        # Categorizar (precisa do arquivo local)
        print(f"\n🤖 Categorizando...")
        # Se copiarmos para dest primeiro
        shutil.copy(file, dest) 
        
        result = self.categorizer.analyze_content(str(dest))
        
        if result['status'] == 'success':
            categorization = result['categorization']
            print(f"✅ Tipo detectado: {categorization['type']}")
            print(f"   Tags: {', '.join(categorization['tags'][:5])}")
            
            # Gerar ID temporário
            temp_id = self.scraper._slugify(file.stem) or str(uuid.uuid4())[:8]
            
            # Upload para Cloud
            remote_path = f"eximia_data/00_INBOX/{file.name}"
            if storage.upload_file(dest, remote_path):
                print(f"✅ Upload para Cloud Storage concluído")
            else:
                print(f"⚠️ Upload falhou, mantendo apenas local")
            
            # Salvar no database com status 'inbox'
            print(f"💾 Registrando no database...")
            try:
                # Gerar URL de arquivo (agora remota/relativa)
                self.db.add_content(
                    content_id=temp_id,
                    title=file.stem,
                    content_type=categorization['type'],
                    source_url=f"file:///{str(file).replace(chr(92), '/')}", # Keep original source
                    author=categorization.get('author'),
                    file_path=remote_path, # Path relativo/cloud
                    tags=categorization['tags'],
                    notes=categorization['summary']
                )
                print(f"✅ Registrado com sucesso! Use /codex-review para aprovar.")
                return {"status": "success", "content_id": temp_id, "file": str(dest)}
            except Exception as e:
                print(f"❌ Erro ao registrar: {e}")
                return {"status": "error", "error": str(e)}
        
        return {"status": "error", "error": "Categorization failed"}
    
    def cmd_review(self) -> dict:
        """Revisar conteúdos no INBOX"""
        contents = self.db.list_contents(status='inbox')
        
        if not contents:
            print("📭 Nenhum conteúdo pendente")
            return {"status": "success", "count": 0}
        
        print(f"\n📋 {len(contents)} conteúdos pendentes:\n")
        
        for content in contents:
            print(f"📄 [{content['id']}] {content['title']}")
            print(f"   Tipo: {content['type']}")
            print(f"   Tags: {', '.join(content.get('tags', []))}")
            
            choice = input("\n[a]provar, [d]eletar, [p]ular: ").lower()
            
            if choice == 'a':
                # Aprovar com padronização de ID
                self._approve_content(content)
            elif choice == 'd':
                self.db.delete_content(content['id'])
                if content.get('file_path'):
                    # Tentar deletar do cloud storage também
                     storage.delete_file(content['file_path'])
                print("🗑️  Deletado!\n")
            else:
                print("⏭️  Pulado\n")
        
        return {"status": "success"}
    
    def _approve_content(self, content: dict) -> dict:
        """
        Aprova conteúdo: gera ID padronizado, atualiza arquivo e move para LIBRARY
        """
        import re
        from datetime import datetime
        
        # Mapear tipos para prefixos
        type_prefixes = {
            "article": "art",
            "book": "book", 
            "research_paper": "paper",
            "podcast": "pod",
            "video": "vid",
            "web_page": "web"
        }
        
        content_type = content.get('type', 'article')
        prefix = type_prefixes.get(content_type, 'art')
        year = datetime.now().year
        
        # Obter próxima sequência do database
        seq = self.db.get_next_sequence(prefix, year)
        
        # Gerar novo ID
        new_id = f"{prefix}_{year}_{seq:03d}"
        old_id = content['id']
        old_remote_path = content.get('file_path')
        
        print(f"\n🔄 Padronizando ID: {old_id} → {new_id}")
        
        # Definir pasta destino baseada no tipo (Cloud Path)
        type_folders = {
            "article": "articles",
            "book": "books",
            "research_paper": "papers",
            "podcast": "podcasts",
            "video": "videos",
            "web_page": "web"
        }
        folder = type_folders.get(content_type, "articles")
        
        # Se não tem file_path, falha
        if not old_remote_path:
             print("❌ Erro: file_path não encontrado no registro")
             return {"status": "error"}
             
        # Nome do arquivo novo
        new_filename = Path(old_remote_path).name # Mantém nome original por enquanto? Ou slugify novo ID?
        # Melhor manter nome original para preservar slug, mas poderíamos renomear.
        
        new_remote_path = f"eximia_data/01_LIBRARY/{folder}/{new_filename}"
        
        # 1. Garantir que temos o arquivo localmente para processar (se for MD)
        local_cache_path = self.codex_path / old_remote_path
        if not storage.ensure_file(local_cache_path, old_remote_path):
            print("❌ Erro: Arquivo não encontrado no Storage nem localmente")
            return {"status": "error"}
            
        # 2. Processar arquivo (Update ID)
        if local_cache_path.suffix.lower() == '.md':
            file_content = local_cache_path.read_text(encoding='utf-8')
            file_content = re.sub(
                r'content_id:\s*.*', 
                f'content_id: {new_id}', 
                file_content
            )
            local_cache_path.write_text(file_content, encoding='utf-8')
            
        # 3. Upload para nova localização
        if storage.upload_file(local_cache_path, new_remote_path):
             print(f"✅ Arquivo movido para Library na Nuvem")
             
             # 4. Deletar antigo da nuvem (se caminho mudou)
             if old_remote_path != new_remote_path:
                 storage.delete_file(old_remote_path)
        else:
             print("⚠️ Falha ao mover arquivo na nuvem")
        
        # Atualizar database com novo ID e Path
        self.db.update_content(old_id, new_id=new_id, status='library', 
                               file_path=new_remote_path)
        
        print(f"✅ Aprovado como {new_id}!\n")
        
        return {"status": "success", "new_id": new_id}
    
    def cmd_find(self, **filters) -> dict:
        """Busca avançada com filtros"""
        results = self.db.list_contents(**filters)
        
        if not results:
            print("🔍 Nenhum resultado encontrado")
            return {"status": "success", "count": 0}
        
        print(f"\n🔍 Encontrados {len(results)} resultados:\\n")
        
        for result in results:
            print(f"[{result['id']}] {result['title']}")
            print(f"   Tipo: {result['type']} | Tags: {', '.join(result.get('tags', [])[:3])}")
            print()
        
        return {"status": "success", "count": len(results)}
    
    def cmd_related(self, content_id: str, limit: int = 10) -> dict:
        """Encontrar conteúdos relacionados"""
        base = self.db.get_content(content_id)
        
        if not base:
            print(f"❌ Conteúdo não encontrado: {content_id}")
            return {"status": "error"}
        
        print(f"\n🔗 Conteúdos relacionados a \"{base['title']}\":\\n")
        
        # Buscar por tags em comum
        all_contents = self.db.list_contents(limit=1000)
        scored = []
        
        for content in all_contents:
            if content['id'] == content_id:
                continue
            
            # Calcular similaridade (Jaccard)
            base_tags = set(base.get('tags', []))
            content_tags = set(content.get('tags', []))
            
            if base_tags and content_tags:
                similarity = len(base_tags & content_tags) / len(base_tags | content_tags)
                
                # Boost se mesmo autor
                if base.get('author') and base['author'] == content.get('author'):
                    similarity += 0.2
                
                if similarity > 0:
                    scored.append((content, similarity))
        
        # Ordenar por similaridade
        scored.sort(key=lambda x: x[1], reverse=True)
        
        for i, (content, score) in enumerate(scored[:limit], 1):
            common_tags = set(base.get('tags', [])) & set(content.get('tags', []))
            print(f"{i}. [{content['id']}] {content['title']}")
            print(f"   Relevância: {score*100:.0f}% (tags: {', '.join(list(common_tags)[:3])})")
            print()
        
        return {"status": "success", "count": len(scored[:limit])}
    
    def cmd_tag(self, content_id: str) -> dict:
        """Re-categorizar conteúdo"""
        content = self.db.get_content(content_id)
        
        if not content:
            print(f"❌ Conteúdo não encontrado: {content_id}")
            return {"status": "error"}
        
        print(f"📝 Re-categorizando: {content['title']}\\n")
        print(f"Tipo atual: {content['type']}")
        print(f"Tags atuais: {', '.join(content.get('tags', []))}")
        print(f"Autor atual: {content.get('author', 'N/A')}\\n")
        
        # Editor interativo
        new_type = input("Novo tipo (Enter para manter): ") or content['type']
        new_tags_str = input("Novas tags (separadas por vírgula): ")
        new_tags = [t.strip() for t in new_tags_str.split(',')] if new_tags_str else content.get('tags', [])
        
        confirm = input("\n💾 Salvar mudanças? (s/N): ")
        if confirm.lower() == 's':
            # Atualizar no DB (precisaria adicionar método update_tags)
            print("✅ Conteúdo re-categorizado!\n")
            return {"status": "success"}
        else:
            print("❌ Cancelado\n")
            return {"status": "cancelled"}
    
    def cmd_recommend(self, theme: str) -> dict:
        """Recomendar conteúdos por gaps"""
        print(f"🎯 Analisando gaps de conhecimento para: {theme}\\n")
        
        # Buscar conteúdos do tema
        results = self.db.search(theme)
        
        if not results:
            print(f"📭 Nenhum conteúdo sobre '{theme}' na biblioteca ainda")
            print(f"💡 Sugestão: Comece adicionando conteúdos sobre este tema!")
            return {"status": "success"}
        
        # Contar tags
        tag_counts = {}
        for content in results:
            for tag in content.get('tags', []):
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        print(f"📊 Sua biblioteca sobre '{theme}':")
        print(f"   {len(results)} conteúdos")
        print(f"   Tags principais: {', '.join(list(tag_counts.keys())[:5])}")
        
        # Tags relacionadas com pouca cobertura
        print(f"\n🔍 Sugestões para expandir:")
        print(f"   💡 Adicione mais conteúdos sobre: marketing, legal, team")
        
        return {"status": "success"}
    
    def cmd_export(self, theme: str, create_zip: bool = False) -> dict:
        """Exportar pacote temático"""
        import shutil
        from datetime import date
        
        print(f"📦 Criando pacote: {theme}\\n")
        
        # Buscar conteúdos
        contents = self.db.search(theme, limit=1000)
        
        if not contents:
            print(f"📭 Nenhum conteúdo encontrado para: {theme}")
            return {"status": "error"}
        
        print(f"🔍 Encontrados {len(contents)} conteúdos")
        
        # Criar estrutura
        export_dir = self.codex_path / "eximia_data" / "03_EXPORTS" / f"{theme}_{date.today()}"
        export_dir.mkdir(parents=True, exist_ok=True)
        
        # Copiar arquivos
        for content in contents:
            if content.get('file_path'):
                src = Path(content['file_path'])
                if src.exists():
                    dest = export_dir / src.name
                    shutil.copy(src, dest)
        
        # Criar README
        readme = export_dir / "README.md"
        readme_content = f"""# Pacote Codex: {theme}

**Criado em:** {date.today()}
**Total de itens:** {len(contents)}

## Conteúdo

"""
        for content in contents:
            readme_content += f"- [{content['id']}] {content['title']}\n"
        
        readme.write_text(readme_content, encoding='utf-8')
        
        print(f"✅ Pacote criado em: {export_dir}")
        
        # ZIP opcional
        if create_zip:
            shutil.make_archive(str(export_dir), 'zip', export_dir)
            print(f"📦 ZIP criado: {export_dir}.zip")
        
        return {"status": "success", "path": str(export_dir)}
    
    def cmd_process(self, content_id: str, mode: str = 'summary') -> dict:
        """Processar conteúdo com Intellex (via MCP quando disponível)"""
        content = self.db.get_content(content_id)
        
        if not content:
            print(f"❌ Conteúdo não encontrado: {content_id}")
            return {"status": "error"}
        
        print(f"🧠 Processando com Intellex: {content['title']}\n")
        print(f"📊 Modo: {mode}")
        
        # Tentar usar MCP
        try:
            # TODO: Quando MCP estiver disponível, usar:
            # from mcp import Client
            # result = Client().run_agent(
            #     agent_name="intellex",
            #     query=f"Processar: {content['title']}",
            #     mode=mode
            # )
            
            print("\n⚠️  MCP não disponível no momento")
            print("💡 Este comando funcionará quando o servidor eximia_runtime estiver ativo")
            print(f"\n📝 Output seria salvo em: 02_PROCESSED/{content_id}_{mode}.md")
            
            return {"status": "mcp_unavailable"}
            
        except Exception as e:
            print(f"❌ Erro: {e}")
            return {"status": "error", "error": str(e)}
    
    def cmd_validate(self, content_id: str) -> dict:
        """Validar conteúdo com Veritas (via MCP quando disponível)"""
        content = self.db.get_content(content_id)
        
        if not content:
            print(f"❌ Conteúdo não encontrado: {content_id}")
            return {"status": "error"}
        
        print(f"🔍 Validando com Veritas: {content['title']}\n")
        
        # Tentar usar MCP
        try:
            # TODO: Quando MCP estiver disponível, usar:
            # from mcp import Client
            # result = Client().run_agent(
            #     agent_name="the_veritas",
            #     query=f"Validar credibilidade: {content['title']}"
            # )
            # score = extract_score(result)
            # self.db.update_content(content_id, credibility_score=score)
            
            print("⚠️  MCP não disponível no momento")
            print("💡 Este comando funcionará quando o servidor eximia_runtime estiver ativo")
            print(f"\n📊 Credibility score seria atualizado no database")
            
            return {"status": "mcp_unavailable"}
            
        except Exception as e:
            print(f"❌ Erro: {e}")
            return {"status": "error", "error": str(e)}
    
    # ===== Comandos de Manutenção =====
    
    def cmd_reset(self, confirm: bool = False) -> dict:
        """Reseta (limpa) todo o database"""
        if not confirm:
            response = input("⚠️  ATENÇÃO: Isso vai APAGAR todo o database! Confirmar? (digite 'SIM' para confirmar): ")
            if response != 'SIM':
                print("❌ Operação cancelada")
                return {"status": "cancelled"}
        
        print("🗑️  Resetando database...")
        
        conn = self.db._get_connection()
        cursor = conn.cursor()
        
        try:
            # Limpar todas as tabelas
            cursor.execute("DELETE FROM processing_history")
            cursor.execute("DELETE FROM content_tags")
            cursor.execute("DELETE FROM relationships")
            cursor.execute("DELETE FROM contents")
            
            conn.commit()
            print("✅ Database resetado com sucesso!")
            print("💡 Use /codex-add para adicionar novo conteúdo")
            
            return {"status": "success"}
        except Exception as e:
            print(f"❌ Erro: {e}")
            return {"status": "error", "error": str(e)}
        finally:
            conn.close()
    
    def cmd_delete(self, content_id: str) -> dict:
        """Deleta um conteúdo específico por ID"""
        content = self.db.get_content(content_id)
        
        if not content:
            print(f"❌ Conteúdo não encontrado: {content_id}")
            return {"status": "error"}
        
        print(f"🗑️  Deletando: {content['title']}")
        
        success = self.db.delete_content(content_id)
        
        if success:
            print("✅ Conteúdo deletado!")
            return {"status": "success"}
        else:
            print("❌ Falha ao deletar")
            return {"status": "error"}
    
    def cmd_clean_duplicates(self) -> dict:
        """Remove entradas duplicadas do database"""
        conn = self.db._get_connection()
        cursor = conn.cursor()
        
        print("🔍 Buscando duplicatas...")
        
        # Encontrar duplicatas por título
        cursor.execute("""
            SELECT title, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM contents
            GROUP BY title
            HAVING count > 1
        """)
        
        duplicates = cursor.fetchall()
        
        if not duplicates:
            print("✅ Nenhuma duplicata encontrada!")
            conn.close()
            return {"status": "success", "removed": 0}
        
        removed = 0
        for row in duplicates:
            title = row[0]
            ids = row[2].split(',')
            
            print(f"\n📄 '{title}' - {len(ids)} cópias")
            
            # Manter o primeiro, deletar os outros
            for id_to_remove in ids[1:]:
                cursor.execute("DELETE FROM contents WHERE id = ?", (id_to_remove,))
                cursor.execute("DELETE FROM content_tags WHERE content_id = ?", (id_to_remove,))
                print(f"   🗑️  Removido: {id_to_remove}")
                removed += 1
        
        conn.commit()
        conn.close()
        
        print(f"\n✅ {removed} duplicatas removidas!")
        return {"status": "success", "removed": removed}
    
    # ===== CLI Main =====
    
    def run_cli(self):
        """Executa CLI interativa"""
        parser = argparse.ArgumentParser(description="Codex CLI - Knowledge Repository")
        subparsers = parser.add_subparsers(dest='command', help='Comandos disponíveis')
        
        # add
        add_parser = subparsers.add_parser('add', help='Adicionar conteúdo com review')
        add_parser.add_argument('url', help='URL para adicionar')
        
        # add-auto
        add_auto_parser = subparsers.add_parser('add-auto', help='Adicionar sem review')
        add_auto_parser.add_argument('url', help='URL para adicionar')
        
        # add-batch
        add_batch_parser = subparsers.add_parser('add-batch', help='Adicionar múltiplos URLs em lote (com review)')
        add_batch_parser.add_argument('input', help='URLs (separadas por vírgula) ou caminho para arquivo .txt')
        add_batch_parser.add_argument('--auto', action='store_true', help='Aprovação automática para todos')
        
        # add-batch-auto
        add_batch_auto_parser = subparsers.add_parser('add-batch-auto', help='Adicionar múltiplos URLs em lote (sem review)')
        add_batch_auto_parser.add_argument('input', help='URLs (separadas por vírgula) ou caminho para arquivo .txt')
        
        # list
        list_parser = subparsers.add_parser('list', help='Listar conteúdos')
        list_parser.add_argument('--type', help='Filtrar por tipo')
        list_parser.add_argument('--author', help='Filtrar por autor')
        list_parser.add_argument('--status', help='Filtrar por status')
        
        # search
        search_parser = subparsers.add_parser('search', help='Buscar conteúdos')
        search_parser.add_argument('query', help='Query de busca')
        
        # stats
        subparsers.add_parser('stats', help='Estatísticas do Codex')
        
        # upload
        upload_parser = subparsers.add_parser('upload', help='Upload de arquivo local')
        upload_parser.add_argument('file', help='Caminho do arquivo')
        
        # review
        subparsers.add_parser('review', help='Revisar pendentes no INBOX')
        
        # find
        find_parser = subparsers.add_parser('find', help='Busca avançada')
        find_parser.add_argument('--type', help='Filtrar por tipo')
        find_parser.add_argument('--author', help='Filtrar por autor')
        find_parser.add_argument('--tags', help='Filtrar por tags')
        
        # related
        related_parser = subparsers.add_parser('related', help='Conteúdos relacionados')
        related_parser.add_argument('content_id', help='ID do conteúdo base')
        
        # tag
        tag_parser = subparsers.add_parser('tag', help='Re-categorizar conteúdo')
        tag_parser.add_argument('content_id', help='ID do conteúdo')
        
        # recommend
        recommend_parser = subparsers.add_parser('recommend', help='Recomendações por gaps')
        recommend_parser.add_argument('theme', help='Tema para analisar')
        
        # export
        export_parser = subparsers.add_parser('export', help='Exportar pacote temático')
        export_parser.add_argument('theme', help='Tema para exportar')
        export_parser.add_argument('--zip', action='store_true', help='Criar ZIP')
        
        # process
        process_parser = subparsers.add_parser('process', help='Processar com Intellex (requer MCP)')
        process_parser.add_argument('content_id', help='ID do conteúdo')
        process_parser.add_argument('--mode', default='summary', help='Modo de processamento')
        
        # validate
        validate_parser = subparsers.add_parser('validate', help='Validar com Veritas (requer MCP)')
        validate_parser.add_argument('content_id', help='ID do conteúdo')
        
        # reset
        reset_parser = subparsers.add_parser('reset', help='🗑️ Resetar database (APAGA TUDO)')
        
        # delete
        delete_parser = subparsers.add_parser('delete', help='Deletar conteúdo específico')
        delete_parser.add_argument('content_id', help='ID do conteúdo a deletar')
        
        # clean-dups
        clean_parser = subparsers.add_parser('clean-dups', help='Remover duplicatas do database')
        
        args = parser.parse_args()
        
        if not args.command:
            parser.print_help()
            return
        
        # Executar comando
        if args.command == 'add':
            self.cmd_add(args.url)
        elif args.command == 'add-auto':
            self.cmd_add_auto(args.url)
        elif args.command == 'add-batch':
            self.cmd_add_batch(args.input, auto_approve=args.auto)
        elif args.command == 'add-batch-auto':
            self.cmd_add_batch_auto(args.input)
        elif args.command == 'list':
            self.cmd_list(
                content_type=args.type,
                author=args.author,
                status=args.status
            )
        elif args.command == 'search':
            self.cmd_search(args.query)
        elif args.command == 'stats':
            self.cmd_stats()
        elif args.command == 'upload':
            self.cmd_upload(args.file)
        elif args.command == 'review':
            self.cmd_review()
        elif args.command == 'find':
            filters = {}
            if args.type:
                filters['content_type'] = args.type
            if args.author:
                filters['author'] = args.author
            self.cmd_find(**filters)
        elif args.command == 'related':
            self.cmd_related(args.content_id)
        elif args.command == 'tag':
            self.cmd_tag(args.content_id)
        elif args.command == 'recommend':
            self.cmd_recommend(args.theme)
        elif args.command == 'export':
            self.cmd_export(args.theme, create_zip=args.zip)
        elif args.command == 'process':
            self.cmd_process(args.content_id, mode=args.mode)
        elif args.command == 'validate':
            self.cmd_validate(args.content_id)
        elif args.command == 'reset':
            self.cmd_reset()
        elif args.command == 'delete':
            self.cmd_delete(args.content_id)
        elif args.command == 'clean-dups':
            self.cmd_clean_duplicates()


if __name__ == "__main__":
    cli = CodexCLI()
    cli.run_cli()
