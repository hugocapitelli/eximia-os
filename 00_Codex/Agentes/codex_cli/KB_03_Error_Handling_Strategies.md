# Error Handling Strategies

## Princípios

1. **Fail Fast** - Detectar erros cedo
2. **Fail Safe** - Degradar graciosamente
3. **Fail Loud** - Comunicar claramente
4. **Fail Smart** - Tentativas de recuperação

## Tipos de Erros

### 1. User Errors (Esperados)
```python
if not url.startswith('http'):
    print("❌ Erro: URL inválida")
    print("💡 Dica: URL deve começar com http:// ou https://")
    sys.exit(2)
```

### 2. System Errors (Recuperáveis)
```python
MAX_RETRIES = 3
for attempt in range(MAX_RETRIES):
    try:
        result = network_call()
        break
    except TimeoutError:
        if attempt == MAX_RETRIES - 1:
            raise
        print(f"⏳ Timeout, tentando novamente ({attempt + 1}/{MAX_RETRIES})...")
        time.sleep(2 ** attempt)  # Exponential backoff
```

### 3. Unexpected Errors (Críticos)
```python
try:
    critical_operation()
except Exception as e:
    logger.critical(f"Erro crítico: {e}", exc_info=True)
    # Notificar desenvolvedor
    # Salvar estado para debug
    raise
```

## Hierarquia de Exceções

```python
class CodexError(Exception):
    """Base exception"""
    pass

class ScraperError(CodexError):
    """Erros de scraping"""
    pass

class NetworkError(ScraperError):
    """Erros de rede"""
    pass

class ParsingError(ScraperError):
    """Erros de parsing"""
    pass

# Uso
try:
    content = scraper.extract(url)
except NetworkError as e:
    print(f"❌ Erro de rede: {e}")
    # Retry lógico
except ParsingError as e:
    print(f"❌ Erro ao processar conteúdo: {e}")
    # Usar fallback
except ScraperError as e:
    print(f"❌ Erro geral de scraping: {e}")
```

## Validação de Input

```python
def validate_url(url: str) -> tuple[bool, str]:
    """Retorna (válido, mensagem_erro)"""
    if not url:
        return False,  "URL não pode ser vazia"
    
    if not url.startswith(('http://', 'https://')):
        return False, "URL deve começar com http:// ou https://"
    
    if len(url) > 2000:
        return False, "URL muito longa"
    
    return True, ""

# Uso
valid, error = validate_url(url)
if not valid:
    print(f"❌ {error}")
    sys.exit(2)
```

## Context Managers

```python
from contextlib import contextmanager

@contextmanager
def safe_file_operation(filename):
    """Garante cleanup mesmo com erro"""
    file = None
    try:
        file = open(filename, 'w')
        yield file
    except IOError as e:
        print(f"❌ Erro ao escrever: {e}")
    finally:
        if file:
            file.close()

# Uso
with safe_file_operation('output.txt') as f:
    f.write(content)
```

## Logging Estruturado

```python
import logging
import json

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': record.created,
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
        }
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        return json.dumps(log_data)

# Configuração
handler = logging.FileHandler('codex.log')
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
```

## Graceful Degradation

```python
def get_content_with_fallback(url):
    # Tentar método principal
    try:
        return trafilatura.extract(url)
    except Exception as e:
        logger.warning(f"Trafilatura failed: {e}, falling back to BeautifulSoup")
        
        # Fallback
        try:
            return beautifulsoup_extract(url)
        except Exception as e2:
            logger.error(f"All extraction methods failed: {e2}")
            
            # Último recurso: retornar HTML raw
            return requests.get(url).text
```

## User-Friendly Messages

### Antes (Ruim)
```python
raise ValueError("Invalid input")
```

### Depois (Bom)
```python
print("❌ Erro: Tipo de conteúdo inválido")
print("💡 Tipos válidos: article, book, research_paper, podcast, video, web_page")
print("📖 Use 'codex add --help' para mais informações")
sys.exit(2)
```

## State Recovery

```python
import pickle

def save_state(state, filename='.codex_state.pkl'):
    """Salva estado para recuperação"""
    with open(filename, 'wb') as f:
        pickle.dump(state, f)

def load_state(filename='.codex_state.pkl'):
    """Recupera estado salvo"""
    try:
        with open(filename, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        return None

# Uso em workflow
try:
    result = long_running_workflow()
except KeyboardInterrupt:
    print("\n⏸️  Workflow interrompido, salvando estado...")
    save_state(current_state)
    print("✅ Estado salvo. Use 'codex resume' para continuar")
```

## Error Codes

```python
class ExitCode:
    SUCCESS = 0
    GENERAL_ERROR = 1
    INVALID_ARGS = 2
    NOT_FOUND = 3
    PERMISSION_DENIED = 4
    NETWORK_ERROR = 5

# Uso
if not file.exists():
    print(f"❌ Arquivo não encontrado: {file}")
    sys.exit(ExitCode.NOT_FOUND)
```

## Assertions vs Exceptions

```python
# Assertions: para developer errors (nunca devem ocorrer)
assert isinstance(data, dict), "Data must be dict"

# Exceptions: para user/runtime errors (podem ocorrer)
if not data:
    raise ValueError("Data cannot be empty")
```

## Referências

- [Python Exception Hierarchy](https://docs.python.org/3/library/exceptions.html)
- [Error Handling Best Practices](https://realpython.com/python-exceptions/)
- [Logging HOWTO](https://docs.python.org/3/howto/logging.html)
