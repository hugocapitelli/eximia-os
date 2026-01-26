import sys
sys.path.insert(0, r"c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS")

from eximia_runtime.core.model_selector import model_selector
import json

query = """Construir um manifesto institucional para a exímIA Ventures, uma holding de excelência empresarial através de IA. 

O manifesto deve capturar:
- Essência da marca (AI First + Virtude Sempre)
- Valores: Human-Centered AI, Rigor e Excelência, Clareza, Empatia
- Propósito: Ampliar a capacidade humana de pensar, decidir e agir através da Tecnologia e IA
- Visão de futuro inspiradora e autêntica
- Tom: Humano, não corporativo; Claro, não complicado; Ético, não oportunista

Referências disponíveis: NARRATIVA_FINAL_HUMAN_CENTERED.md, NARRATIVA_INSTITUCIONAL_V2_VENTURES.md
"""

result = model_selector.select_model(
    agent_name="the_maestro",
    query=query,
    agent_tier=3
)

print(json.dumps(result, indent=2, ensure_ascii=False))
