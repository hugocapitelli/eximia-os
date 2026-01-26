import sys
import os

# Add the eximIA.OS directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from eximia_runtime.core.model_selector import model_selector

query = """Desenvolver narrativa institucional completa e estrutura chamativa para o site da exímIA Ventures, incluindo ideação, planejamento estratégico, arquitetura de conteúdo e storytelling corporativo"""

result = model_selector.select_model('the_maestro', query, 3)

print('=' * 60)
print('=== RECOMENDAÇÃO DO MODEL SELECTOR ENGINE ===')
print('=' * 60)
print(f'\n🤖 Agente: {result["agent_name"]}')
print(f'📊 Nível de Complexidade: {result["complexity_level"]}')
print(f'   Score: {result["complexity_score"]}/5')
print(f'\n✅ Modelo Recomendado: {result["recommended_model"]}')
print(f'\n💡 Razão: {result["reasoning"]}')
print(f'\n🔄 Alternativas:')
for alt in result["alternatives"]:
    print(f'   - {alt}')
print('=' * 60)
