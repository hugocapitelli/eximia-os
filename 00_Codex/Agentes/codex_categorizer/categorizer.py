#!/usr/bin/env python3
"""
Codex Categorizer - AI Content Categorization Agent (Tier 1)
Analisa conteúdo e sugere categorização automática usando Gemini
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Optional

try:
    import google.generativeai as genai
except ImportError:
    genai = None


class CodexCategorizer:
    """Agente de categorização de conteúdo com IA"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.confidence_threshold = 0.7
        self.max_tags = 10
        
        # Configurar Gemini se disponível
        if genai and api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def analyze_content(
        self, 
        file_path: str,
        initial_metadata: Optional[Dict] = None
    ) -> Dict:
        """
        Analisa conteúdo e retorna categorização
        
        Args:
            file_path: Caminho para arquivo markdown
            initial_metadata: Metadata inicial extraída pelo scraper
        
        Returns:
            Dict com status, categorização completa
        """
        try:
            # Tentar ler como texto (UTF-8)
            try:
                content = Path(file_path).read_text(encoding='utf-8')
                # Extrair partes do content
                title, body = self._parse_markdown(content)
                
                # Categorizar com IA ou Fallback
                if self.model:
                    categorization = self._categorize_with_gemini(title, body, initial_metadata)
                else:
                    categorization = self._categorize_fallback(title, body, initial_metadata)
            except UnicodeDecodeError:
                # Se falhar, é arquivo binário (PDF, EPUB, etc)
                print(f"⚠️ Arquivo binário detectado ({Path(file_path).suffix}). Usando heurística de nome.")
                title = initial_metadata.get('title') if initial_metadata else Path(file_path).stem
                body = "Binary content (PDF/EPUB/Archive)"
                
                # Heurística simples de tipo baseado em extensão
                ext = Path(file_path).suffix.lower()
                auto_type = "article"
                if ext == ".pdf": auto_type = "book"
                elif ext == ".epub": auto_type = "book"
                
                categorization = {
                    "type": auto_type,
                    "tags": ["uploaded", "binary", ext.replace('.', '')],
                    "author": "Unknown",
                    "summary": f"Binary file: {Path(file_path).name}",
                    "confidence": 0.5
                }
            
            # Validar confidence
            if categorization.get('confidence', 0) < self.confidence_threshold:
                categorization['warning'] = f"Low confidence: {categorization.get('confidence')}"
            
            return {
                "status": "success",
                "content_id": Path(file_path).stem,
                "categorization": categorization
            }
        
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "file_path": file_path
            }
    
    def _parse_markdown(self, content: str) -> tuple:
        """Parse markdown para extrair título e corpo"""
        lines = content.split('\n')
        title = "Untitled"
        body_lines = []
        
        in_frontmatter = False
        frontmatter_ended = False
        
        for line in lines:
            if line.strip() == '---':
                if not in_frontmatter:
                    in_frontmatter = True
                    continue
                else:
                    frontmatter_ended = True
                    in_frontmatter = False
                    continue
            
            if in_frontmatter:
                if line.startswith('title:'):
                    title = line.split(':', 1)[1].strip()
                continue
            
            if frontmatter_ended:
                if line.startswith('# '):
                    title = line[2:].strip()
                    continue
                body_lines.append(line)
        
        return title, '\n'.join(body_lines).strip()
    
    def _categorize_with_gemini(
        self,
        title: str,
        body: str,
        initial_metadata: Optional[Dict]
    ) -> Dict:
        """Categoriza usando Gemini"""
        
        # Limitar corpo a ~2000 palavras para o prompt
        words = body.split()[:2000]
        body_sample = ' '.join(words)
        
        prompt = f"""Analise o seguinte conteúdo e retorne uma categorização em JSON:

TÍTULO: {title}

CONTEÚDO:
{body_sample}

Retorne APENAS um JSON válido com esta estrutura:
{{
  "type": "article|book|research_paper|podcast|video|web_page",
  "tags": ["tag1", "tag2", ...],  // máximo 10 tags relevantes
  "author": "Nome do Autor" ou null,
  "summary": "Resumo em 2-3 frases",
  "confidence": 0.0-1.0  // score de confiança
}}

Regras:
- Tags devem ser em inglês, minúsculas, single-word quando possível
- Summary deve ser concisa e objetiva
- Confidence deve refletir sua certeza na categorização
"""
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Extrair JSON do response (pode vir com ```json```)
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group(1)
            
            categorization = json.loads(result_text)
            
            # Validar estrutura
            required_keys = ['type', 'tags', 'summary', 'confidence']
            if not all(k in categorization for k in required_keys):
                raise ValueError("Missing required keys in response")
            
            # Limitar tags
            categorization['tags'] = categorization['tags'][:self.max_tags]
            
            # Merge com initial_metadata
            if initial_metadata:
                if not categorization.get('author') and initial_metadata.get('author'):
                    categorization['author'] = initial_metadata['author']
            
            return categorization
        
        except Exception as e:
            print(f"Gemini categorization failed: {e}")
            return self._categorize_fallback(title, body, initial_metadata)
    
    def _categorize_fallback(
        self,
        title: str,
        body: str,
        initial_metadata: Optional[Dict]
    ) -> Dict:
        """Categorização básica sem IA"""
        
        # Detectar tipo por padrões
        content_type = "article"  # padrão
        
        # Simples keyword matching para tags
        keywords = self._extract_keywords(title + " " + body)
        tags = keywords[:self.max_tags]
        
        summary = f"{title[:100]}..."
        
        return {
            "type": content_type,
            "tags": tags,
            "author": initial_metadata.get('author') if initial_metadata else None,
            "summary": summary,
            "confidence": 0.5  # baixa confidence para fallback
        }
    
    def _extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """Extrai keywords básicas do texto (fallback)"""
        # Remover pontuação e minúsculas
        text = re.sub(r'[^\w\s]', '', text.lower())
        
        # Palavras comuns para filtrar (stopwords básicas)
        stopwords = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'em', 'no', 'na'
        }
        
        # Contar frequência de palavras
        words = [w for w in text.split() if len(w) > 3 and w not in stopwords]
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Top keywords por frequência
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:max_keywords]]


# Exemplo de uso
if __name__ == "__main__":
    import os
    
    # Tentar pegar API key do ambiente
    api_key = os.getenv('GEMINI_API_KEY')
    
    categorizer = CodexCategorizer(api_key=api_key)
    
    # Testar com um arquivo de exemplo
    result = categorizer.analyze_content(
        "example.md",
        initial_metadata={"title": "Example Article", "author": "John Doe"}
    )
    
    print(f"Status: {result['status']}")
    if result['status'] == 'success':
        cat = result['categorization']
        print(f"Type: {cat['type']}")
        print(f"Tags: {', '.join(cat['tags'])}")
        print(f"Confidence: {cat['confidence']}")
