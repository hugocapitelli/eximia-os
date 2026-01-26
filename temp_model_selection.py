"""Temporary script to get model recommendation"""
import sys
sys.path.insert(0, r'c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS')

from eximia_runtime.core.model_selector import model_selector

query = """Planejar e idealizar uma plataforma de gestão financeira pessoal e empresarial 
com separação por cartões, contas, categorização de gastos, planejamento financeiro e 
dashboard de controle. Criar arquitetura, funcionalidades, UX/UI, stack tecnológica e 
roadmap de implementação."""

result = model_selector.select_model(
    agent_name="the_maestro",
    query=query,
    agent_tier=3
)

print("\n" + "="*80)
print("MODEL SELECTION RECOMMENDATION")
print("="*80)
print(f"\nAgent: {result['agent_name']}")
print(f"Complexity Score: {result['complexity_score']}/5")
print(f"Complexity Level: {result['complexity_level']}")
print(f"\nRecommended Model: {result['recommended_model']}")
print(f"\nReasoning: {result['reasoning']}")
print(f"\nAlternatives: {', '.join(result['alternatives'])}")
print("="*80 + "\n")
