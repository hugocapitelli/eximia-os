#!/usr/bin/env python3
"""
Codex Scraper - Web Content Extraction Agent (Tier 1)
Extrai conteúdo de URLs e converte para Markdown limpo
"""

import re
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional
from urllib.parse import urlparse

try:
    import trafilatura
except ImportError:
    trafilatura = None

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

from .content_cleaner import ContentCleaner


class CodexScraper:
    """Agente de extração de conteúdo web para Codex"""
    
    def __init__(self, inbox_path: Optional[Path] = None):
        if inbox_path is None:
            # Path relativo ao agente
            # scraper.py está em 00_Codex/Agentes/codex_scraper/
            # parent = codex_scraper, parent.parent = Agentes, parent.parent.parent = 00_Codex
            codex_root = Path(__file__).parent.parent.parent
            inbox_path = codex_root / "eximia_data" / "00_INBOX"
        
        self.inbox_path = Path(inbox_path)
        self.inbox_path.mkdir(parents=True, exist_ok=True)
        self.timeout = 30
        self.cleaner = ContentCleaner()  # Limpeza de conteúdo
    
    def extract_url(self, url: str, content_type_hint: Optional[str] = None) -> Dict:
        """
        Extrai conteúdo de uma URL e retorna metadata + arquivo markdown
        
        Args:
            url: URL para extrair
            content_type_hint: Hint de tipo (article, pdf, video)
        
        Returns:
            Dict com status, content_id, file_path, metadata
        """
        try:
            # Baixar conteúdo
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=self.timeout)
            response.raise_for_status()
            
            # Detectar tipo de conteúdo
            content_type = response.headers.get('content-type', '').lower()
            
            if 'pdf' in content_type:
                return self._extract_pdf(url, response.content)
            else:
                return self._extract_html(url, response.text)
        
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "url": url
            }
    
    def _extract_html(self, url: str, html: str) -> Dict:
        """Extrai conteúdo de HTML e converte para Markdown limpo"""
        
        # Tentar trafilatura primeiro (melhor para artigos)
        if trafilatura:
            markdown_content = trafilatura.extract(
                html,
                output_format='markdown',
                include_comments=False,
                include_tables=True
            )
        else:
            # Fallback para BeautifulSoup
            markdown_content = self._html_to_markdown_fallback(html)
        
        if not markdown_content:
            return {
                "status": "error",
                "error": "Failed to extract content from HTML",
                "url": url
            }
        
        # Extrair metadata PRIMEIRO (precisamos do título para limpeza)
        metadata = self._extract_metadata(html, url)
        
        # Remove elementos de UI, login walls, navegação
        # Passa o título para remover duplicatas
        markdown_content = self.cleaner.clean(markdown_content, title=metadata['title'])
        
        # Aplicar formatação de estrutura (títulos, subtítulos) hiper-conservadora
        markdown_content = self._apply_structure(
            markdown_content, 
            title=metadata['title'],
            author=metadata['author'] or "",
            date=metadata.get('date') or ""
        )
        
        # Gerar nome de arquivo baseado no título
        filename = self._slugify(metadata['title'])
        content_id = filename  # ID = nome do arquivo
        
        # Salvar arquivo markdown
        file_path = self.inbox_path / f"{filename}.md"
        
        # Verificar se já existe (adicionar sufixo se necessário)
        counter = 1
        original_filename = filename
        while file_path.exists():
            filename = f"{original_filename}_{counter}"
            file_path = self.inbox_path / f"{filename}.md"
            content_id = filename
            counter += 1
        
        # Criar conteúdo do arquivo com frontmatter
        full_content = f"""---
title: {metadata['title']}
author: {metadata.get('author', 'Unknown')}
source_url: {url}
date_scraped: {datetime.now().isoformat()}
content_id: {content_id}
---

# {metadata['title']}

> **Fonte:** {url}  
> **Autor:** {metadata.get('author', 'Desconhecido')}  
> **Data:** {metadata.get('date', 'N/A')}

---

{markdown_content}
"""
        
        file_path.write_text(full_content, encoding='utf-8')
        
        return {
            "status": "success",
            "content_id": content_id,
            "file_path": str(file_path),
            "metadata": metadata
        }
    
    def _extract_pdf(self, url: str, pdf_content: bytes) -> Dict:
        """Extrai texto de PDF"""
        # Placeholder: Implementação completa requer PyPDF2 ou similar
        return {
            "status": "error",
            "error": "PDF extraction not yet implemented",
            "url": url
        }
    
    def _extract_metadata(self, html: str, url: str) -> Dict:
        """Extrai metadata de HTML"""
        metadata = {
            "title": self._extract_title(html, url),
            "author": self._extract_author(html, url),
            "date": self._extract_date(html),
            "word_count": 0
        }
        
        # Contar palavras no conteúdo limpo
        if trafilatura:
            text = trafilatura.extract(html, output_format='text')
            if text:
                metadata['word_count'] = len(text.split())
        
        return metadata
    
    def _extract_title(self, html: str, url: str) -> str:
        """Extrai título da página"""
        if BeautifulSoup:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Tentar meta og:title
            og_title = soup.find('meta', property='og:title')
            if og_title and og_title.get('content'):
                return og_title['content']
            
            # Tentar tag title
            title_tag = soup.find('title')
            if title_tag:
                return title_tag.text.strip()
        
        # Fallback: usar parte da URL
        return urlparse(url).path.split('/')[-1] or "Untitled"
    
    def _extract_author(self, html: str, url: str = None) -> Optional[str]:
        """
        Extrai autor da página, com suporte especial para redes sociais
        
        Args:
            html: HTML da página
            url: URL da página para detectar rede social
        """
        if not BeautifulSoup:
            return None
            
        soup = BeautifulSoup(html, 'html.parser')
        
        # Detectar rede social pela URL
        social_network = None
        if url:
            url_lower = url.lower()
            if 'linkedin.com' in url_lower:
                social_network = 'linkedin'
            elif 'twitter.com' in url_lower or 'x.com' in url_lower:
                social_network = 'twitter'
            elif 'medium.com' in url_lower:
                social_network = 'medium'
            elif 'substack.com' in url_lower:
                social_network = 'substack'
            elif 'facebook.com' in url_lower:
                social_network = 'facebook'
        
        # === Estratégias específicas por rede social ===
        
        if social_network == 'linkedin':
            # LinkedIn: tentar pegar o nome do perfil/empresa
            # Meta tag og:title geralmente contém "Título | Nome do Autor | LinkedIn"
            og_title = soup.find('meta', property='og:title')
            if og_title and og_title.get('content'):
                title = og_title['content']
                # Padrão: "Título do Artigo | LinkedIn" ou "Nome | LinkedIn"
                # Para pulses/articles: tentar extrair do texto
                pass
            
            # Tentar meta twitter:creator
            twitter_creator = soup.find('meta', attrs={'name': 'twitter:creator'})
            if twitter_creator and twitter_creator.get('content'):
                return twitter_creator['content'].lstrip('@')
            
            # Buscar pelo padrão de nome de empresa/perfil no texto
            # LinkedIn articles geralmente têm o autor em elementos específicos
            author_elem = soup.find('meta', property='article:author')
            if author_elem and author_elem.get('content'):
                return author_elem['content']
        
        elif social_network == 'twitter':
            # Twitter/X: usar o @ do autor
            twitter_creator = soup.find('meta', attrs={'name': 'twitter:creator'})
            if twitter_creator and twitter_creator.get('content'):
                return twitter_creator['content']
        
        elif social_network == 'medium':
            # Medium: author meta tag
            author_meta = soup.find('meta', attrs={'name': 'author'})
            if author_meta and author_meta.get('content'):
                return author_meta['content']
        
        elif social_network == 'substack':
            # Substack: geralmente no og:site_name
            site_name = soup.find('meta', property='og:site_name')
            if site_name and site_name.get('content'):
                return site_name['content']
        
        # === Estratégias genéricas (fallback) ===
        
        # 1. Meta author (padrão)
        author_meta = soup.find('meta', attrs={'name': 'author'})
        if author_meta and author_meta.get('content'):
            return author_meta['content']
        
        # 2. Meta article:author
        article_author = soup.find('meta', property='article:author')
        if article_author and article_author.get('content'):
            return article_author['content']
        
        # 3. Schema.org author
        author_script = soup.find('script', type='application/ld+json')
        if author_script:
            try:
                import json
                data = json.loads(author_script.string)
                if isinstance(data, dict):
                    author_data = data.get('author', {})
                    if isinstance(author_data, dict):
                        return author_data.get('name')
                    elif isinstance(author_data, str):
                        return author_data
            except:
                pass
        
        # 4. Twitter creator (genérico)
        twitter_creator = soup.find('meta', attrs={'name': 'twitter:creator'})
        if twitter_creator and twitter_creator.get('content'):
            return twitter_creator['content'].lstrip('@')
        
        # 5. Tentar extrair do og:site_name como último recurso para redes sociais
        if social_network:
            site_name = soup.find('meta', property='og:site_name')
            if site_name and site_name.get('content'):
                name = site_name['content']
                # Não retornar nomes genéricos
                if name.lower() not in ['linkedin', 'twitter', 'facebook', 'medium', 'x']:
                    return name
        
        return None
    
    def _extract_date(self, html: str) -> Optional[str]:
        """Extrai data de publicação"""
        if BeautifulSoup:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Tentar meta article:published_time
            published = soup.find('meta', property='article:published_time')
            if published and published.get('content'):
                return published['content']
        
        return None
    
    def _html_to_markdown_fallback(self, html: str) -> str:
        """Conversão básica HTML → Markdown usando BeautifulSoup"""
        if not BeautifulSoup:
            return ""
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remover scripts, styles, nav, footer
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        
        # Pegar texto limpo
        text = soup.get_text(separator='\n\n')
        
        # Limpar espaços extras
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r' {2,}', ' ', text)
        
        return text.strip()
    
    def generate_id(self, content_type: str, year: int) -> str:
        """
        Gera ID único para conteúdo
        
        Args:
            content_type: Tipo do conteúdo (art, book, paper, etc)
            year: Ano atual
        
        Returns:
            ID no formato: {type}_{year}_{counter}
        """
        # Prefixos por tipo
        type_prefixes = {
            "article": "art",
            "book": "book",
            "research_paper": "paper",
            "podcast": "pod",
            "video": "vid",
            "web_page": "web"
        }
        
        prefix = type_prefixes.get(content_type, "art")
        
        # Contar arquivos existentes com este prefixo
        existing = list(self.inbox_path.glob(f"{prefix}_{year}_*.md"))
        counter = len(existing) + 1
        
        return f"{prefix}_{year}_{counter:03d}"
    
    def _slugify(self, text: str, max_length: int = 60) -> str:
        """
        Converte texto em slug para nome de arquivo
        
        Args:
            text: Texto para converter
            max_length: Tamanho máximo do slug
        
        Returns:
            Slug válido para nome de arquivo
        """
        import unicodedata
        
        # Normalizar e remover acentos
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ASCII', 'ignore').decode('ASCII')
        
        # Converter para lowercase
        text = text.lower()
        
        # Substituir espaços e caracteres inválidos por underscores
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[\s_-]+', '_', text)
        
        # Remover underscores do início/fim
        text = text.strip('_')
        
        # Truncar se necessário
        if len(text) > max_length:
            text = text[:max_length].rsplit('_', 1)[0]
        
        return text or 'untitled'
    
    def _apply_structure(self, content: str) -> str:
        """
        Detecta e aplica formatação de estrutura (títulos, subtítulos)
        
        Args:
            content: Conteúdo markdown
        
        Returns:
            Conteúdo com estrutura markdown aplicada
        """
        lines = content.split('\n')
        result = []
        
    def _apply_structure(self, content: str, title: str = "", author: str = "", date: str = "") -> str:
        """Detecta subtítulos (H2) de forma hiper-conservadora"""
        if not content:
            return content
            
        lines = content.split('\n')
        result = []
        
        # Palavras comuns em UI que NÃO devem ser títulos (Blacklist expandida)
        ui_blacklist = [
            'fechar', 'início', 'menu', 'pular', 'mais lidas', 'hoje', 'semana', 'mês', 'ano',
            'compartilhar', 'newsletter', 'assuntos', 'veja também', 'leia mais', 'publicidade',
            'inscrição', 'sucesso', 'política', 'privacidade', 'termos', 'serviço', 'google',
            'apple', 'microsoft', 'facebook', 'linkedin', 'twitter', 'x', 'instagram',
            'leitura', 'minuto', 'copiar', 'link', 'fonte', 'autor', 'data', 'atualizado',
            'pular para o conteúdo', 'pular para o menu', 'anuncie', 'contato', 'redes sociais',
            'todos os direitos reservados', 'ajuda', 'suporte', 'login', 'entrar', 'cadastre-se',
            'notícias relacionadas', 'leia também', 'tópicos relacionados', 'compartilhar essa notícia'
        ]
        
        # Indicadores semânticos fortes que QUEREMOS como header
        section_indicators = [
            'conclusão', 'introdução', 'resumo', 'abstract', 'referências', 
            'metodologia', 'resultados', 'considerações finais',
            'por que', 'o que é', 'como funciona', 'principais benefícios',
            'vantagens', 'desvantagens'
        ]
        
        # Metadata para evitar transformar autor/data em header
        metadata_to_ignore = [title.lower(), author.lower(), date.lower()]
        
        prev_line_empty = True
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Já é um header, manter
            if stripped.startswith('#'):
                result.append(line)
                prev_line_empty = False
                continue
            
            # Linha vazia
            if not stripped:
                result.append('')
                prev_line_empty = True
                continue
            
            # Detectar se é um título de seção
            is_section_title = False
            
            # 1. Critérios de isolamento: deve estar entre linhas vazias (ou ser a primeira/última)
            next_line_empty = (i == len(lines) - 1) or not lines[i+1].strip()
            
            if prev_line_empty and next_line_empty:
                length = len(stripped)
                stripped_lower = stripped.lower()
                
                # Regra A: Filtro de comprimento (4 a 80 caracteres)
                if 4 < length < 80:
                    
                    # Regra B: Blacklist de UI exata ou início de linha
                    is_ui = any(stripped_lower == word or stripped_lower.startswith(word + " ") for word in ui_blacklist)
                    
                    # Regra C: Evitar fragmentos de frase (termina em preposição, conjunção ou hifen)
                    # Adicionado hifen e travessão como indicadores de fragmento
                    is_fragment = re.search(r'\s(a|o|e|de|da|do|em|no|na|com|para|por|à|ao|ou|que|se|um|uma|[-–—])$', stripped_lower) or stripped.endswith(',')
                    
                    # Regra D: Ignorar metadata (Autor, Data, Título repetido)
                    # Adicionada detecção de data numérica (DD/MM/AAAA)
                    is_date = re.match(r'^\d{2}/\d{2}/\d{4}', stripped) or re.search(r'\d{2}:\d{2}', stripped)
                    is_metadata = is_date or any(m and (m in stripped_lower or stripped_lower in m) for m in metadata_to_ignore if len(m) > 4)
                    
                    if not is_ui and not is_fragment and not is_metadata:
                        # Deve começar com Maiúscula ou Número
                        if stripped[0].isupper() or stripped[0].isdigit():
                            
                            # Sinal 1: Indicador semântico forte
                            has_indicator = any(ind in stripped_lower for ind in section_indicators)
                            
                            # Sinal 2: É todo em maiúsculas (e longo o suficiente)
                            is_all_caps = stripped.isupper() and len(re.findall(r'[A-Z]', stripped)) > 5
                            
                            # Sinal 3: Frase curta sem pontuação final (estilo header)
                            is_pointless = not stripped.endswith(('.', ':', ';', '!', '?', '”', '"'))
                            
                            if has_indicator or is_all_caps:
                                is_section_title = True
                            elif is_pointless and length < 55:
                                # Verificação profunda da próxima linha não-vazia
                                next_non_empty = ""
                                for j in range(i+1, min(i+10, len(lines))):
                                    if lines[j].strip():
                                        next_non_empty = lines[j].strip()
                                        break
                                
                                # Se a próxima linha começa com minúscula, era continuação de frase!
                                if next_non_empty and next_non_empty[0].islower():
                                    is_section_title = False
                                # Se a linha atual é muito curta e não tem indicador, provavelmente é ruído
                                elif length < 10 and not is_all_caps:
                                    is_section_title = False
                                else:
                                    is_section_title = True
            
            if is_section_title:
                result.append(f"## {stripped}")
            else:
                result.append(line)
            
            prev_line_empty = False
        
        return '\n'.join(result)
    
    def clean_content(self, content: str) -> str:
        """Limpa conteúdo removendo elementos indesejados"""
        # Remover múltiplas linhas vazias
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Remover espaços no final das linhas
        content = re.sub(r' +\n', '\n', content)
        
        # Remover caracteres de controle
        content = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', content)
        
        return content.strip()


# Exemplo de uso
if __name__ == "__main__":
    scraper = CodexScraper()
    
    # Testar com um artigo
    result = scraper.extract_url("https://example.com")
    
    print(f"Status: {result['status']}")
    if result['status'] == 'success':
        print(f"Content ID: {result['content_id']}")
        print(f"File saved: {result['file_path']}")
        print(f"Title: {result['metadata']['title']}")
