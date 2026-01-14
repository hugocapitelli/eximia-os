---
description: Execute produção intelectual com Intellex (livros, papers, frameworks)
---
1. Analise o pedido do usuário para identificar qual módulo usar:
   - **Book_Processor**: Se o usuário quer resumir/analisar um livro
   - **Paper_Generator**: Se o usuário quer criar um artigo científico
   - **Framework_Creator**: Se o usuário quer criar ou empacotar um framework

2. Para **Book_Processor**:
   - Solicite o arquivo do livro (PDF, EPUB) ou peça que o usuário cole o conteúdo
   - Execute pipeline: K1_Ingester → K2_Analyzer → K3_Extractor → Book_Processor
   - Pergunte qual nível de resumo desejado (L1 a L5)
   - Gere o output no formato solicitado

3. Para **Paper_Generator**:
   - Solicite: tema, tese central, tipo de paper (research, review, theoretical)
   - Execute Veritas primeiro para pesquisa de literatura
   - Gere estrutura IMRaD ou equivalente
   - Produza o paper completo com citações

4. Para **Framework_Creator**:
   - Identifique o modo:
     - **CREATE**: Novo framework a partir de gap/problema
     - **PACKAGE**: Empacotar ideias existentes do usuário
   
   - Para modo CREATE:
     a. Execute Veritas para pesquisar frameworks existentes no domínio
     b. Identifique gaps e oportunidades
     c. Execute pipeline de 7 etapas (Discovery → Packaging)
     d. Gere: Nome memorável + Visualização + Canvas

   - Para modo PACKAGE:
     a. Solicite as ideias brutas do usuário
     b. Identifique padrões e estrutura latente
     c. Organize em framework coeso
     d. Gere: Nome memorável + Visualização + Canvas

5. Consulte as Knowledge Bases conforme necessário:
   - `Intellex/modules/Framework_Creator/knowledge_base/KB_famous_frameworks.md`
   - `Intellex/modules/Framework_Creator/knowledge_base/KB_naming_patterns.md`
   - `Intellex/modules/Framework_Creator/knowledge_base/KB_visual_templates.md`

6. Salve outputs em `Intellex/outputs/{project_slug}/`

7. Após conclusão, pergunte se o usuário deseja:
   - Refinar o output
   - Gerar versões adicionais (Canvas, Whitepaper, etc.)
   - Integrar com Clone_Factory (para criar clone do autor)
