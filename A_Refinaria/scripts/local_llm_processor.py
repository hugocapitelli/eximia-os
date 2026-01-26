"""
Local LLM Processor para Intellex
Permite que Antigravity chame Qwen2.5 (ou outro modelo Ollama) automaticamente

Uso:
    python local_llm_processor.py --prompt "path/to/prompt.txt" --output "path/to/output.md" --model qwen2.5:32b
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import ollama
except ImportError:
    print("❌ Erro: Biblioteca 'ollama' não instalada.")
    print("Execute: pip install ollama")
    sys.exit(1)


def process_with_local_llm(prompt_path, output_path, model="qwen2.5:32b", temperature=1.0, max_tokens=8192):
    """
    Processa um prompt usando LLM local via Ollama
    
    Args:
        prompt_path: Caminho para arquivo .txt com o prompt
        output_path: Caminho onde salvar o output
        model: Modelo Ollama a usar (default: qwen2.5:32b)
        temperature: Criatividade (0.0-2.0, default: 1.0)
        max_tokens: Máximo de tokens a gerar (default: 8192)
    """
    
    print(f"🚀 Iniciando processamento com {model}...")
    
    # Ler prompt
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            prompt = f.read()
        print(f"✅ Prompt carregado: {len(prompt)} caracteres")
    except FileNotFoundError:
        print(f"❌ Erro: Arquivo não encontrado: {prompt_path}")
        sys.exit(1)
    
    # Configurações de geração
    options = {
        "temperature": temperature,
        "num_predict": max_tokens,
        "top_p": 0.95,
        "top_k": 64,
    }
    
    print(f"⚙️ Configurações:")
    print(f"   - Temperature: {temperature}")
    print(f"   - Max tokens: {max_tokens}")
    print(f"   - Top-p: 0.95")
    
    # Chamar Ollama
    try:
        print(f"\n🔄 Gerando resposta (isso pode demorar 5-15 minutos)...")
        
        response = ollama.generate(
            model=model,
            prompt=prompt,
            options=options,
            stream=True  # Stream para mostrar progresso
        )
        
        full_response = ""
        tokens_generated = 0
        
        # Processar stream
        for chunk in response:
            if 'response' in chunk:
                text = chunk['response']
                full_response += text
                tokens_generated += 1
                
                # Mostrar progresso a cada 100 tokens
                if tokens_generated % 100 == 0:
                    word_count = len(full_response.split())
                    print(f"   📊 Progresso: {tokens_generated} tokens, ~{word_count} palavras")
        
        # Estatísticas finais
        word_count = len(full_response.split())
        char_count = len(full_response)
        
        print(f"\n✅ Geração completa!")
        print(f"   📏 Palavras: {word_count}")
        print(f"   📏 Caracteres: {char_count}")
        print(f"   📏 Tokens: {tokens_generated}")
        
    except ollama.ResponseError as e:
        print(f"❌ Erro ao chamar Ollama: {e}")
        print(f"   Certifique-se que o servidor está rodando: ollama serve")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        sys.exit(1)
    
    # Salvar output
    try:
        output_path_obj = Path(output_path)
        output_path_obj.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(full_response)
        
        print(f"💾 Output salvo em: {output_path}")
        
    except Exception as e:
        print(f"❌ Erro ao salvar arquivo: {e}")
        sys.exit(1)
    
    # Retornar métricas
    return {
        "success": True,
        "word_count": word_count,
        "char_count": char_count,
        "tokens": tokens_generated,
        "output_path": str(output_path)
    }


def main():
    parser = argparse.ArgumentParser(
        description="Processa prompts usando LLM local (Ollama) para Intellex"
    )
    
    parser.add_argument(
        "--prompt",
        required=True,
        help="Caminho para arquivo .txt com o prompt"
    )
    
    parser.add_argument(
        "--output",
        required=True,
        help="Caminho onde salvar o output .md"
    )
    
    parser.add_argument(
        "--model",
        default="qwen2.5:32b",
        help="Modelo Ollama a usar (default: qwen2.5:32b)"
    )
    
    parser.add_argument(
        "--temperature",
        type=float,
        default=1.0,
        help="Temperature (0.0-2.0, default: 1.0)"
    )
    
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=8192,
        help="Máximo de tokens (default: 8192)"
    )
    
    args = parser.parse_args()
    
    # Processar
    result = process_with_local_llm(
        prompt_path=args.prompt,
        output_path=args.output,
        model=args.model,
        temperature=args.temperature,
        max_tokens=args.max_tokens
    )
    
    # Output JSON para Antigravity parsear
    print(f"\n📊 RESULT_JSON: {json.dumps(result)}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
