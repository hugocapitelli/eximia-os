#!/usr/bin/env python3
"""
Content Cleaner - Limpeza e formatação de conteúdo extraído
Remove elementos de UI, login walls, navegação e formata texto limpo
"""

import re
from typing import List, Tuple


class ContentCleaner:
    """Remove ruído de conteúdo web e formata para leitura"""
    
    # Padrões de UI comuns a remover
    UI_PATTERNS = [
        # Login/Auth
        r'(?i)sign\s*in',
        r'(?i)log\s*in',
        r'(?i)create\s*(your\s*)?(free\s*)?account',
        r'(?i)join\s*(now|linkedin|free)',
        r'(?i)forgot\s*password',
        r'(?i)remember\s*me',
        r'(?i)email\s*or\s*phone',
        r'(?i)welcome\s*back',
        
        # Social/Sharing
        r'(?i)share\s*(on|to|via)?\s*(facebook|twitter|linkedin|x\b)',
        r'(?i)\+?\s*subscribe',
        r'(?i)follow\s*(us|me)?',
        r'(?i)\d+\s*follower',
        r'(?i)like\s*comment',
        r'(?i)add\s*a?\s*comment',
        
        # Cookie/Privacy
        r'(?i)cookie\s*policy',
        r'(?i)privacy\s*policy',
        r'(?i)user\s*agreement',
        r'(?i)terms\s*(of\s*service|and\s*conditions)',
        r'(?i)by\s*clicking\s*continue',
        r'(?i)accept\s*(all\s*)?cookies?',
        
        # Navigation
        r'(?i)skip\s*to\s*(main\s*)?content',
        r'(?i)show\s*(more|less)',
        r'(?i)read\s*more',
        r'(?i)see\s*all',
        r'(?i)explore\s*(content\s*)?categories',
        r'(?i)back\s*to\s*top',
        r'(?i)next\s*article',
        r'(?i)previous\s*article',
        
        # App promotions
        r'(?i)(download|get)\s*(the|our)\s*app',
        r'(?i)better\s*on\s*(the\s*)?app',
        r'(?i)open\s*(in\s*)?(the\s*)?app',
        r'(?i)microsoft\s*store',
        r'(?i)app\s*store',
        r'(?i)google\s*play',
        
        # Newsletter/Ads
        r'(?i)subscribe\s*(to\s*)?(our\s*)?(newsletter|updates)',
        r'(?i)get\s*(the\s*)?(latest|updates)',
        r'(?i)sponsored\s*(content|post)',
        r'(?i)advertisement',
        
        # Reading time indicators
        r'(?i)^\d+\s*min\s*read$',
        r'(?i)^\d+\s*minute\s*read$',
        r'(?i)^reading\s*time',
    ]
    
    # Linhas inteiras a remover (exact match after strip, case insensitive)
    REMOVE_LINES = [
        'show', 'like', 'comment', 'share', 'copy', 'or',
        'linkedin', 'facebook', 'twitter', 'x', 'instagram',
        '.', ',', '|', '-', '—', '·', '•',
        'password', 'email', 'phone',
        ', and', 'and',
    ]
    
    # Padrões de blocos a remover completamente
    BLOCK_PATTERNS = [
        # Login walls
        r'(?is)sign\s*in\s*to\s*view.*?(?=\n\n|\Z)',
        r'(?is)create\s*your\s*free\s*account.*?(?=\n\n|\Z)',
        r'(?is)by\s*clicking\s*continue.*?(?=\n\n|\Z)',
        # Related articles sections
        r'(?is)more\s*articles\s*by.*?(?=\n\n\n|\Z)',
        r'(?is)related\s*(articles?|posts?).*?(?=\n\n\n|\Z)',
        r'(?is)also\s*read.*?(?=\n\n\n|\Z)',
        # Comment sections
        r'(?is)to\s*view\s*or\s*add\s*a?\s*comment.*?(?=\n\n|\Z)',
        # Category explorers
        r'(?is)explore\s*content\s*categories.*?(?=\Z)',
        # Flexa Cloud specific (repeated author blocks)
        r'(?is)flexa\s*cloud\s*insights\s*\n.*?followers?.*?(?=\n\n|\Z)',
    ]
    
    # Linhas que devem ser removidas se aparecem como linhas isoladas
    ISOLATED_LINE_PATTERNS = [
        r'^new\s*to\s*linkedin\??$',
        r'^don\'?t\s*have\s*the\s*app\??.*$',
        r'^\d+\s*followers?$',
        r'^[\+\-]\s*subscribe$',
        r'^share$',
        r'^copy$',
        r'^like$',
        r'^comment$',
        # Reading time
        r'^\d+\s*min\s*read$',
        r'^\d+\s*minute\s*read$',
        # CTA patterns
        r'^quer\s+(saber|entender|conhecer).*\?$',
        r'^conhe[cç]a\s+(as\s+)?solu[cç][oõ]es.*$',
    ]
    
    def __init__(self):
        # Compilar patterns para eficiência
        self.ui_patterns_compiled = [
            re.compile(p) for p in self.UI_PATTERNS
        ]
        self.block_patterns_compiled = [
            re.compile(p) for p in self.BLOCK_PATTERNS
        ]
        self.isolated_patterns_compiled = [
            re.compile(p, re.IGNORECASE) for p in self.ISOLATED_LINE_PATTERNS
        ]
    
    def clean(self, content: str, title: str = None) -> str:
        """
        Pipeline completo de limpeza
        
        Args:
            content: Texto markdown bruto extraído
            title: Título do artigo (para remover duplicatas)
        
        Returns:
            Texto limpo e formatado
        """
        if not content:
            return ""
        
        # 0. Guardar título para remoção de duplicata
        self._title = title
        
        # 1. Remover blocos problemáticos
        content = self._remove_blocks(content)
        
        # 2. Processar linha a linha
        content = self._process_lines(content)
        
        # 3. Remover título duplicado no início
        content = self._remove_duplicate_title(content)
        
        # 4. Limpar formatação
        content = self._clean_formatting(content)
        
        # 5. Detectar e formatar listas
        content = self._detect_lists(content)
        
        # 6. Reconstruir parágrafos
        content = self._reconstruct_paragraphs(content)
        
        # 7. Validar qualidade
        if not self._validate_content(content):
            return "[Conteúdo não pôde ser extraído - página pode requerer login]"
        
        return content
    
    def _remove_blocks(self, content: str) -> str:
        """Remove blocos inteiros de UI"""
        for pattern in self.block_patterns_compiled:
            content = pattern.sub('', content)
        return content
    
    def _process_lines(self, content: str) -> str:
        """Processa cada linha removendo UI patterns"""
        lines = content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            
            # Pular linhas vazias por agora
            if not line:
                cleaned_lines.append('')
                continue
            
            # Verificar linhas isoladas a remover (case insensitive)
            if line.lower() in [r.lower() for r in self.REMOVE_LINES]:
                continue
            
            # Verificar patterns de linhas isoladas
            is_isolated = False
            for pattern in self.isolated_patterns_compiled:
                if pattern.match(line):
                    is_isolated = True
                    break
            if is_isolated:
                continue
            
            # Verificar patterns de UI (em linhas curtas)
            is_ui = False
            for pattern in self.ui_patterns_compiled:
                if pattern.search(line):
                    # Se a linha é curta, provavelmente é UI
                    if len(line) < 60:
                        is_ui = True
                        break
            
            if is_ui:
                continue
            
            # Remover linhas que são apenas números (contadores, etc)
            if re.match(r'^\d+$', line):
                continue
            
            # Remover linhas que começam com datas soltas
            if re.match(r'^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}$', line):
                continue
            
            cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def _clean_formatting(self, content: str) -> str:
        """Limpa formatação markdown e espaçamento"""
        # Remover múltiplas linhas vazias consecutivas
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Remover espaços no final das linhas
        content = re.sub(r' +$', '', content, flags=re.MULTILINE)
        
        # Normalizar separadores markdown
        content = re.sub(r'\n---+\n', '\n\n---\n\n', content)
        
        # Remover caracteres de controle
        content = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', content)
        
        # Limpar espaços duplos dentro de linhas
        content = re.sub(r'  +', ' ', content)
        
        # Corrigir espaços antes de pontuação
        content = re.sub(r'\s+([.,;:!?])', r'\1', content)
        
        return content.strip()
    
    def _remove_duplicate_title(self, content: str) -> str:
        """Remove título duplicado no início do conteúdo (pode aparecer várias vezes)"""
        if not hasattr(self, '_title') or not self._title:
            return content
        
        lines = content.split('\n')
        result = []
        
        # Normalizar título para comparação
        title_norm = self._title.lower().strip()
        title_norm = re.sub(r'\s+', ' ', title_norm).rstrip('.:!?')
        
        # Tentar capturar o título puro sem o nome do site (ex: "Titulo - InfoMoney")
        title_pure = re.sub(r'\s+[-|]\s+.*$', '', title_norm).strip()
        
        # Metadata editorial a remover se aparecer perto do título
        editorial_noise = [
            'conteúdo editorial apoiado por',
            'publicidade',
            'continua depois da publicidade',
            'atualizado',
            'minutos de leitura'
        ]
        
        # Analisar apenas as primeiras 15 linhas para duplicatas de título
        for i, line in enumerate(lines):
            stripped = line.strip()
            if not stripped:
                if i < 15: continue # Pular linhas vazias no início
                result.append(line)
                continue
                
            line_norm = re.sub(r'\s+', ' ', stripped.lower()).rstrip('.:!?')
            
            if i < 15:
                # Verificar se é duplicata do título
                is_duplicate = (
                    line_norm == title_norm or 
                    line_norm == title_pure or
                    (len(line_norm) > 15 and line_norm in title_norm) or
                    (len(title_pure) > 15 and title_pure in line_norm)
                )
                
                # Verificar se é ruído editorial
                is_editorial = any(noise in line_norm for noise in editorial_noise)
                
                if is_duplicate or is_editorial:
                    continue
            
            result.append(line)
        
        return '\n'.join(result)
    
    def _detect_lists(self, content: str) -> str:
        """
        Detecta padrões de lista e formata com bullet points
        
        APENAS formata como lista quando há padrões muito claros:
        - Linhas curtas APÓS uma linha que termina com ":"
        - E as linhas são claramente itens (similares entre si)
        """
        lines = content.split('\n')
        result = []
        in_list_context = False
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Linha vazia - resetar contexto de lista
            if not stripped:
                in_list_context = False
                result.append(line)
                continue
            
            # Já é lista/header - manter
            if stripped.startswith(('#', '-', '*', '•')) or re.match(r'^\d+\.', stripped):
                result.append(line)
                continue
            
            # Verificar se a linha anterior termina com ":"
            if result:
                prev = result[-1].strip()
                if prev.endswith(':') and not prev.startswith('#'):
                    in_list_context = True
            
            # Se estamos em contexto de lista E a linha é curta E parece item
            if in_list_context and len(stripped) < 80:
                # Verificar se parece um item (curto, sem ponto final ou com estrutura "Termo: descrição")
                looks_like_item = (
                    not stripped.endswith('.') or
                    re.match(r'^[A-Z][^:]{1,30}:', stripped)  # "Termo: descrição"
                )
                
                if looks_like_item and not stripped.startswith('-'):
                    result.append(f"- {stripped}")
                    continue
            else:
                # Linha longa resetar contexto
                if len(stripped) > 100:
                    in_list_context = False
            
            result.append(line)
        
        return '\n'.join(result)
    
    def _reconstruct_paragraphs(self, content: str) -> str:
        """Reconstrói parágrafos fragmentados de forma inteligente"""
        lines = content.split('\n')
        result = []
        current_para = []
        
        def flush_para():
            """Salva o parágrafo atual nos resultados"""
            if current_para:
                result.append(' '.join(current_para))
            current_para.clear()
        
        def looks_like_continuation(line: str) -> bool:
            """Verifica se a linha parece ser continuação de outra"""
            # Começa com letra minúscula
            if line and line[0].islower():
                return True
            # Começa com pontuação de continuação
            if line.startswith((',', '.', ':', ';', '—', '–')):
                return True
            return False
        
        def looks_like_complete_sentence(line: str) -> bool:
            """Verifica se a linha parece ser uma sentença completa"""
            if not line:
                return False
            # Termina com pontuação final
            if line.rstrip()[-1] in '.!?':
                return True
            # É um header
            if line.startswith('#'):
                return True
            return False
        
        i = 0
        while i < len(lines):
            stripped = lines[i].strip()
            
            # Linha vazia - potencial fim de parágrafo
            if not stripped:
                # Verificar se próximas linhas não-vazias parecem continuação
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    j += 1
                
                # Se há conteúdo após as linhas vazias
                if j < len(lines):
                    next_line = lines[j].strip()
                    # Se próxima linha parece continuação, não quebrar parágrafo
                    if looks_like_continuation(next_line):
                        i += 1
                        continue
                
                # Caso contrário, finalizar parágrafo
                if current_para:
                    flush_para()
                i += 1
                continue
            
            # Headers sempre em linhas separadas
            if stripped.startswith('#'):
                if current_para:
                    flush_para()
                result.append(stripped)
                i += 1
                continue
            
            # Listas sempre em linhas separadas
            if re.match(r'^[-*•]\s', stripped) or re.match(r'^\d+\.\s', stripped):
                if current_para:
                    flush_para()
                result.append(stripped)
                i += 1
                continue
            
            # Linha normal - adicionar ao parágrafo atual
            current_para.append(stripped)
            
            # Se parece sentença completa e próxima linha não parece continuação,
            # considerar fim de parágrafo
            if looks_like_complete_sentence(stripped):
                # Ver próxima linha não-vazia
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    j += 1
                
                if j < len(lines):
                    next_line = lines[j].strip()
                    # Se próxima começa com maiúscula e não é continuação
                    if next_line and next_line[0].isupper() and not looks_like_continuation(next_line):
                        # Potencial novo parágrafo, mas continuar acumulando por agora
                        pass
            
            i += 1
        
        # Não esquecer último parágrafo
        if current_para:
            flush_para()
        
        return '\n\n'.join(result)
    
    def _validate_content(self, content: str) -> bool:
        """Valida se o conteúdo extraído é útil"""
        if len(content) < 100:
            return False
        
        # Contar palavras reais
        words = content.split()
        if len(words) < 20:
            return False
        
        return True
    
    def extract_main_content(self, content: str) -> Tuple[str, dict]:
        """
        Extrai conteúdo principal e detecta metadados adicionais
        
        Returns:
            Tuple de (conteúdo limpo, metadados detectados)
        """
        cleaned = self.clean(content)
        
        metadata = {
            'word_count': len(cleaned.split()),
            'paragraph_count': cleaned.count('\n\n') + 1,
            'has_headers': '#' in cleaned,
            'has_lists': bool(re.search(r'^[-*•]\s|^\d+\.\s', cleaned, re.MULTILINE)),
        }
        
        return cleaned, metadata


# Singleton instance
_cleaner = None

def get_cleaner() -> ContentCleaner:
    """Retorna instância singleton do cleaner"""
    global _cleaner
    if _cleaner is None:
        _cleaner = ContentCleaner()
    return _cleaner


def clean_content(content: str) -> str:
    """Função de conveniência para limpeza rápida"""
    return get_cleaner().clean(content)


if __name__ == "__main__":
    # Teste básico
    test_content = """
    Sign in to view more content
    
    Create your free account
    
    Email or phone
    Password
    Show
    
    ---
    
    # Artigo Interessante
    
    Este é o conteúdo principal do artigo que deveria ser preservado.
    Com múltiplos parágrafos importantes.
    
    ## Seção 2
    
    Mais conteúdo relevante aqui.
    
    Like Comment Share
    
    5 followers
    
    + Subscribe
    """
    
    cleaner = ContentCleaner()
    result = cleaner.clean(test_content)
    print("=== RESULTADO ===")
    print(result)
