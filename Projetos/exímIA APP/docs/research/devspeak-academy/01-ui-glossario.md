# Relatório Completo: UI & Glossário para Desenvolvedores Web

## Módulo de Aprendizado: Pixel Perfect Development

Este relatório apresenta uma lista completa e estruturada de todos os conceitos técnicos essenciais para o módulo "UI & Glossário", organizado em categorias para facilitar o aprendizado de desenvolvedores web focados em desenvolvimento Pixel Perfect.

---

## 1. Terminologia de UI (User Interface)

### 1.1 Viewport e Exibição

| Termo | Descrição |
|-------|-----------|
| **Viewport** | Área visível de uma página web na tela do dispositivo. É a "janela" através da qual o usuário visualiza o conteúdo |
| **Breakpoint** | Largura de tela específica onde o layout muda para se adaptar a diferentes dispositivos. Definido via media queries CSS |
| **Responsive Design** | Abordagem de design que permite que layouts se adaptem automaticamente a diferentes tamanhos de tela usando grids fluidos e media queries |
| **Adaptive Design** | Design que detecta o dispositivo e carrega layouts pré-definidos específicos para cada tamanho, sem transições fluidas |
| **Fluid Design** | Layout que usa unidades relativas (%, rem, vw, vh) permitindo que elementos escalem proporcionalmente ao viewport |
| **Mobile First** | Estratégia de desenvolvimento que prioriza a experiência mobile, expandindo progressivamente para telas maiores |

### 1.2 Pixel e Densidade de Tela

| Termo | Descrição |
|-------|-----------|
| **Pixel** | Menor unidade de uma imagem digital. Em CSS, 1px é uma unidade abstrata que pode representar múltiplos pixels físicos |
| **Pixel Density** | Quantidade de pixels por unidade física de tela, medida em PPI ou DPI |
| **PPI (Pixels Per Inch)** | Pixels por polegada - mede a densidade de pixels em uma tela ou imagem |
| **DPI (Dots Per Inch)** | Pontos por polegada - originalmente usado para impressão, às vezes usado intercambiavelmente com PPI |
| **Device Pixel Ratio (DPR)** | Razão entre pixels físicos e pixels CSS. Telas Retina têm DPR de 2 ou mais |
| **Retina Display** | Telas de alta densidade onde pixels individuais são imperceptíveis ao olho humano (DPR ≥ 2) |
| **CSS Pixels** | Unidade abstrata de medida em CSS, independente da densidade física da tela |
| **Physical Pixels** | Pixels reais/hardware da tela do dispositivo |

### 1.3 Conceitos de Layout Visual

| Termo | Descrição |
|-------|-----------|
| **Above the Fold** | Conteúdo visível sem necessidade de scroll. Termo herdado de jornais impressos |
| **Below the Fold** | Conteúdo que requer scroll para ser visualizado |
| **Whitespace (Negative Space)** | Espaço vazio intencional entre elementos que melhora legibilidade e hierarquia visual |
| **Visual Hierarchy** | Organização de elementos por importância usando tamanho, cor, contraste e posição |
| **Golden Ratio** | Proporção matemática (~1.618) frequentemente usada para criar layouts visualmente harmoniosos |
| **Rule of Thirds** | Técnica de composição que divide a tela em uma grade 3x3 para posicionamento de elementos |

---

## 2. Tipos de Componentes UI

### 2.1 Controles de Entrada (Input Controls)

| Componente | Descrição |
|------------|-----------|
| **Button** | Elemento interativo que executa uma ação quando clicado/tocado. Tipos: primary, secondary, tertiary, ghost, icon button |
| **Input Field** | Campo de texto para entrada de dados. Tipos: text, password, email, number, tel, url, search |
| **Textarea** | Campo de texto multilinha para entradas extensas |
| **Checkbox** | Controle de seleção binário (marcado/desmarcado) que permite múltiplas seleções em um grupo |
| **Radio Button** | Botão circular para seleção única dentro de um grupo de opções mutuamente exclusivas |
| **Toggle/Switch** | Interruptor liga/desliga para ações imediatas (sem necessidade de submissão) |
| **Dropdown/Select** | Menu suspenso que revela uma lista de opções ao clicar |
| **Combobox** | Combinação de input text com dropdown, permitindo digitação e seleção |
| **Date Picker** | Componente para seleção de datas via calendário visual |
| **Time Picker** | Componente para seleção de horários |
| **Color Picker** | Interface para seleção de cores |
| **Slider/Range** | Controle deslizante para selecionar valores em um intervalo |
| **File Upload** | Componente para upload de arquivos com drag-and-drop ou seleção |
| **Autocomplete** | Input com sugestões dinâmicas baseadas na digitação do usuário |

### 2.2 Navegação (Navigation Components)

| Componente | Descrição |
|------------|-----------|
| **Navbar (Navigation Bar)** | Barra de navegação principal, geralmente no topo da página |
| **Sidebar** | Painel lateral de navegação, pode ser fixo ou retrátil |
| **Breadcrumb** | Trilha de navegação hierárquica mostrando o caminho até a página atual |
| **Tabs** | Abas para alternar entre seções de conteúdo relacionado na mesma área |
| **Pagination** | Controles para navegar entre páginas de conteúdo (anterior, próximo, números) |
| **Menu** | Lista de opções de navegação ou ações |
| **Hamburger Menu** | Ícone de três linhas horizontais que expande/recolhe menus em mobile |
| **Kebab Menu** | Três pontos verticais indicando menu de opções adicionais |
| **Meatballs Menu** | Três pontos horizontais indicando mais opções disponíveis |
| **Mega Menu** | Menu expandido com múltiplas colunas e categorias |
| **Bottom Navigation** | Barra de navegação fixa na parte inferior, comum em apps mobile |
| **Stepper** | Indicador de progresso em processos multi-etapas |

### 2.3 Feedback e Informação

| Componente | Descrição |
|------------|-----------|
| **Modal/Dialog** | Janela sobreposta que requer interação antes de retornar ao conteúdo principal |
| **Tooltip** | Pequena caixa de texto que aparece ao passar o mouse sobre um elemento |
| **Popover** | Caixa flutuante com conteúdo mais rico que tooltip, acionada por clique |
| **Toast/Snackbar** | Notificação temporária que aparece brevemente, geralmente no canto da tela |
| **Alert/Banner** | Mensagem de destaque para informações importantes, avisos ou erros |
| **Progress Bar** | Indicador visual de progresso de uma tarefa |
| **Spinner/Loader** | Animação indicando carregamento ou processamento |
| **Skeleton** | Placeholder animado que simula o layout do conteúdo durante carregamento |
| **Empty State** | Tela ou componente exibido quando não há dados/conteúdo disponível |

### 2.4 Exibição de Dados (Data Display)

| Componente | Descrição |
|------------|-----------|
| **Card** | Container que agrupa informações relacionadas com borda e/ou sombra |
| **List** | Sequência vertical de itens relacionados |
| **Table** | Estrutura de dados em linhas e colunas |
| **Data Grid** | Tabela avançada com funcionalidades de ordenação, filtro e edição |
| **Avatar** | Imagem circular representando usuário ou entidade |
| **Badge** | Pequeno indicador numérico ou de status, geralmente sobreposto a outro elemento |
| **Chip/Tag** | Elemento compacto para representar atributos, categorias ou filtros |
| **Accordion** | Seções colapsáveis que expandem/recolhem ao clicar |
| **Carousel/Slider** | Componente para navegar horizontalmente entre itens de conteúdo |
| **Timeline** | Visualização cronológica de eventos |
| **Tree View** | Estrutura hierárquica expansível (pastas/arquivos) |

### 2.5 Sobreposições (Overlays)

| Componente | Descrição |
|------------|-----------|
| **Overlay** | Camada semi-transparente que cobre o conteúdo de fundo |
| **Backdrop** | Fundo escurecido atrás de modais e drawers |
| **Drawer** | Painel que desliza da lateral da tela |
| **Sheet (Bottom Sheet)** | Painel que desliza de baixo para cima, comum em mobile |
| **Lightbox** | Sobreposição para exibição ampliada de imagens/mídia |

---

## 3. Conceitos de Layout

### 3.1 Sistemas de Layout CSS

| Conceito | Descrição |
|----------|-----------|
| **CSS Grid** | Sistema de layout bidimensional (linhas e colunas) para criar estruturas complexas |
| **Flexbox** | Sistema de layout unidimensional (linha OU coluna) ideal para alinhamento e distribuição |
| **Subgrid** | Permite que elementos filhos herdem a grade do pai (suporte universal em 2025) |
| **Multi-column Layout** | Layout CSS para dividir conteúdo em múltiplas colunas estilo jornal |
| **Float** | Método legado de layout onde elementos "flutuam" à esquerda ou direita |

### 3.2 Grid e Flexbox - Propriedades Essenciais

| Propriedade | Descrição |
|-------------|-----------|
| **display: grid** | Ativa o modo de layout Grid no container |
| **display: flex** | Ativa o modo de layout Flexbox no container |
| **grid-template-columns/rows** | Define a estrutura de colunas/linhas da grade |
| **grid-gap / gap** | Espaçamento entre células da grade |
| **flex-direction** | Define o eixo principal do flexbox (row, column) |
| **justify-content** | Alinhamento no eixo principal |
| **align-items** | Alinhamento no eixo transversal |
| **align-content** | Distribuição de múltiplas linhas no eixo transversal |
| **flex-wrap** | Permite que itens quebrem para próxima linha |
| **flex-grow/shrink** | Controla como itens expandem/encolhem |
| **order** | Controla a ordem de exibição dos itens flex |

### 3.3 Estruturas Semânticas de Página

| Elemento | Descrição |
|----------|-----------|
| **Header** | Cabeçalho da página ou seção, contém logo, navegação, ações |
| **Footer** | Rodapé com informações secundárias, links, copyright |
| **Main** | Conteúdo principal único da página |
| **Nav** | Seção de navegação |
| **Aside** | Conteúdo lateral relacionado (sidebar) |
| **Section** | Agrupamento temático de conteúdo |
| **Article** | Conteúdo independente e auto-contido |
| **Container** | Wrapper que centraliza e limita a largura do conteúdo |
| **Wrapper** | Elemento que envolve outros para aplicar estilos ou layout |

### 3.4 Seções Comuns de Página

| Seção | Descrição |
|-------|-----------|
| **Hero** | Seção de destaque no topo da página com headline, CTA e imagem/vídeo |
| **CTA (Call to Action)** | Área ou botão que incentiva ação específica do usuário |
| **Feature Section** | Área destacando funcionalidades ou benefícios |
| **Testimonials** | Seção com depoimentos de clientes |
| **Pricing** | Tabela ou cards com planos e preços |
| **FAQ** | Seção de perguntas frequentes (geralmente com accordions) |
| **Contact** | Formulário ou informações de contato |

### 3.5 Posicionamento CSS

| Valor | Descrição |
|-------|-----------|
| **static** | Posicionamento padrão, segue o fluxo normal do documento |
| **relative** | Posicionado relativo à sua posição original, mantém espaço no fluxo |
| **absolute** | Removido do fluxo, posicionado relativo ao ancestral posicionado mais próximo |
| **fixed** | Removido do fluxo, posicionado relativo ao viewport (não scrolla) |
| **sticky** | Híbrido que age como relative até cruzar um threshold, então fica "grudado" |

### 3.6 Z-Index e Stacking Context

| Conceito | Descrição |
|----------|-----------|
| **z-index** | Propriedade que define a ordem de empilhamento de elementos posicionados |
| **Stacking Context** | Contexto tridimensional isolado onde z-index é avaliado. Elementos dentro de um contexto são agrupados |
| **isolation: isolate** | Cria um novo stacking context sem efeitos colaterais |
| **Stacking Order** | Ordem em que elementos são renderizados: background/borders → z-index negativos → conteúdo → z-index positivos |

---

## 4. Termos de Design Visual

### 4.1 Espaçamento (Spacing)

| Termo | Descrição |
|-------|-----------|
| **Padding** | Espaço interno entre o conteúdo e a borda do elemento |
| **Margin** | Espaço externo entre a borda do elemento e elementos adjacentes |
| **Gap** | Espaçamento entre itens em Grid ou Flexbox |
| **Gutter** | Espaço entre colunas em um sistema de grid |
| **Spacing Scale** | Sistema de valores de espaçamento consistentes (4px, 8px, 16px, 24px, etc.) |

### 4.2 Bordas e Sombras

| Termo | Descrição |
|-------|-----------|
| **Border** | Linha ao redor de um elemento (width, style, color) |
| **Border-radius** | Arredondamento dos cantos de um elemento |
| **Box-shadow** | Sombra aplicada à caixa do elemento (offset-x, offset-y, blur, spread, color) |
| **Text-shadow** | Sombra aplicada ao texto |
| **Elevation** | Conceito de profundidade visual representado por sombras (nivel 0-5) |
| **Drop Shadow** | Sombra projetada, comum em imagens e elementos flutuantes |
| **Inset Shadow** | Sombra interna, criando efeito de "afundamento" |

### 4.3 Cores e Transparência

| Termo | Descrição |
|-------|-----------|
| **HEX** | Notação hexadecimal de cor (#RRGGBB ou #RGB) |
| **HEX com Alpha** | HEX com transparência (#RRGGBBAA) |
| **RGB** | Modelo de cor (Red, Green, Blue) com valores 0-255 |
| **RGBA** | RGB com canal Alpha para transparência (0.0 a 1.0) |
| **HSL** | Modelo Hue (matiz 0-360°), Saturation (0-100%), Lightness (0-100%) |
| **HSLA** | HSL com canal Alpha |
| **Opacity** | Propriedade CSS que define a opacidade de todo o elemento (0 a 1) |
| **Transparency** | Grau em que a luz passa através de um elemento |
| **Alpha Channel** | Canal que controla a transparência em formatos de cor |

### 4.4 Gradientes e Efeitos

| Termo | Descrição |
|-------|-----------|
| **Linear Gradient** | Gradiente em linha reta entre duas ou mais cores |
| **Radial Gradient** | Gradiente circular/elíptico emanando de um ponto central |
| **Conic Gradient** | Gradiente que gira ao redor de um ponto central |
| **Blur** | Efeito de desfoque aplicado a elementos ou fundos |
| **Backdrop Filter** | Filtros aplicados ao fundo atrás de um elemento (blur, saturate, etc.) |
| **Glassmorphism** | Estilo visual com fundo semi-transparente com blur (efeito "vidro fosco") |
| **Neumorphism** | Estilo com sombras suaves criando efeito de "extrusão" do fundo |

### 4.5 Tipografia

| Termo | Descrição |
|-------|-----------|
| **Font-family** | Família tipográfica (ex: 'Inter', 'Roboto', sans-serif) |
| **Font-size** | Tamanho do texto (px, rem, em) |
| **Font-weight** | Peso/espessura da fonte (100-900, normal, bold) |
| **Line-height** | Altura da linha, afeta espaçamento vertical entre linhas |
| **Letter-spacing** | Espaçamento entre caracteres (tracking) |
| **Word-spacing** | Espaçamento entre palavras |
| **Text-align** | Alinhamento horizontal do texto (left, center, right, justify) |
| **Text-transform** | Transformação de caixa (uppercase, lowercase, capitalize) |
| **Text-decoration** | Decoração do texto (underline, line-through, none) |
| **Font Stack** | Lista de fontes em ordem de preferência como fallback |
| **Web Font** | Fonte carregada via @font-face ou serviço como Google Fonts |
| **Variable Font** | Fonte com eixos ajustáveis (peso, largura, itálico) em um único arquivo |
| **Typography Scale** | Sistema hierárquico de tamanhos de texto (h1-h6, body, caption) |

---

## 5. Padrões de Interação

### 5.1 Estados de Componentes

| Estado | Descrição |
|--------|-----------|
| **Default** | Estado padrão/normal do elemento |
| **Hover** | Estado quando o cursor está sobre o elemento (sem clicar) |
| **Focus** | Estado quando o elemento está selecionado (teclado ou clique) |
| **Active** | Estado durante o pressionamento do elemento |
| **Disabled** | Estado desabilitado, não interativo |
| **Loading** | Estado durante carregamento ou processamento |
| **Error** | Estado indicando erro ou validação falha |
| **Success** | Estado indicando ação bem-sucedida |
| **Selected** | Estado de item selecionado em lista ou grupo |
| **Visited** | Estado de link já visitado |

### 5.2 Transições e Animações

| Termo | Descrição |
|-------|-----------|
| **Transition** | Mudança suave entre estados CSS (property, duration, timing-function, delay) |
| **Animation** | Sequência de mudanças de estilo definidas por @keyframes |
| **Keyframes** | Pontos de controle que definem estados em uma animação CSS |
| **Timing Function** | Curva de aceleração (ease, linear, ease-in, ease-out, cubic-bezier) |
| **Duration** | Tempo de duração da transição/animação |
| **Delay** | Tempo de espera antes de iniciar transição/animação |
| **Micro-interaction** | Pequena animação de feedback para ações do usuário |
| **Motion Design** | Disciplina de usar movimento para melhorar UX |

### 5.3 Gestos (Mobile/Touch)

| Gesto | Descrição |
|-------|-----------|
| **Tap** | Toque único na tela (equivalente ao clique) |
| **Double Tap** | Dois toques rápidos em sequência |
| **Long Press** | Toque mantido por período prolongado |
| **Swipe** | Deslizar o dedo na tela em uma direção |
| **Pinch** | Movimento de pinça para zoom out |
| **Spread** | Movimento de expansão para zoom in |
| **Pan** | Arrastar o conteúdo em qualquer direção |
| **Drag** | Arrastar um elemento de um ponto a outro |
| **Pull to Refresh** | Puxar para baixo para atualizar conteúdo |

### 5.4 Comportamentos de Scroll

| Termo | Descrição |
|-------|-----------|
| **Scroll Behavior** | Propriedade CSS que define scroll suave ou instantâneo |
| **Infinite Scroll** | Carregamento contínuo de conteúdo ao rolar |
| **Virtual Scroll** | Renderização apenas dos itens visíveis em listas longas |
| **Parallax** | Efeito onde elementos se movem em velocidades diferentes durante scroll |
| **Scroll Snap** | "Encaixe" automático em pontos específicos do scroll |
| **Overscroll Behavior** | Comportamento quando scroll atinge os limites |
| **Scroll Lock** | Prevenção de scroll no body quando modal está aberto |

### 5.5 Padrões de Carregamento

| Padrão | Descrição |
|--------|-----------|
| **Lazy Loading** | Carregamento sob demanda, quando o conteúdo está próximo de ser visível |
| **Eager Loading** | Carregamento imediato de todos os recursos |
| **Progressive Loading** | Carregamento gradual de conteúdo (baixa qualidade → alta qualidade) |
| **Skeleton Loading** | Placeholder animado que simula a estrutura do conteúdo |
| **Shimmer Effect** | Animação de brilho em skeletons indicando carregamento |
| **LQIP (Low Quality Image Placeholder)** | Imagem de baixa resolução como placeholder |
| **Blur-up** | Técnica onde imagem borrada é substituída pela versão nítida |

---

## 6. Acessibilidade (a11y)

### 6.1 HTML Semântico

| Elemento | Descrição |
|----------|-----------|
| **`<header>`** | Cabeçalho de página ou seção |
| **`<nav>`** | Seção de navegação |
| **`<main>`** | Conteúdo principal da página |
| **`<article>`** | Conteúdo independente |
| **`<section>`** | Seção temática de conteúdo |
| **`<aside>`** | Conteúdo relacionado lateral |
| **`<footer>`** | Rodapé |
| **`<figure>/<figcaption>`** | Figura com legenda |
| **`<time>`** | Data/hora legível por máquina |
| **`<mark>`** | Texto destacado/relevante |
| **`<details>/<summary>`** | Disclosure widget nativo |

### 6.2 ARIA - Roles de Landmark

| Role | Descrição |
|------|-----------|
| **banner** | Cabeçalho da página (geralmente `<header>`) |
| **navigation** | Navegação principal |
| **main** | Conteúdo principal |
| **complementary** | Conteúdo complementar (aside) |
| **contentinfo** | Informações do documento (footer) |
| **search** | Funcionalidade de busca |
| **form** | Formulário identificável |
| **region** | Região genérica com nome acessível |

### 6.3 ARIA - Roles de Widget

| Role | Descrição |
|------|-----------|
| **button** | Elemento clicável que executa ação |
| **checkbox** | Caixa de seleção |
| **dialog** | Janela modal |
| **menu/menuitem** | Menu e seus itens |
| **tab/tablist/tabpanel** | Interface de abas |
| **alert** | Mensagem importante |
| **progressbar** | Indicador de progresso |
| **slider** | Controle deslizante |
| **tooltip** | Dica de contexto |
| **tree/treeitem** | Visualização em árvore |
| **listbox/option** | Lista de seleção |
| **combobox** | Campo com dropdown |
| **grid/gridcell** | Grade de dados |

### 6.4 Estados e Propriedades ARIA

| Atributo | Descrição |
|----------|-----------|
| **aria-label** | Rótulo acessível para elemento |
| **aria-labelledby** | Referência a elemento que serve como rótulo |
| **aria-describedby** | Referência a elemento com descrição adicional |
| **aria-hidden** | Oculta elemento de tecnologias assistivas |
| **aria-expanded** | Indica se seção expansível está aberta/fechada |
| **aria-selected** | Indica item selecionado |
| **aria-checked** | Estado de checkbox/switch |
| **aria-disabled** | Indica elemento desabilitado |
| **aria-required** | Indica campo obrigatório |
| **aria-invalid** | Indica erro de validação |
| **aria-live** | Região com conteúdo dinâmico (polite, assertive) |
| **aria-busy** | Indica que região está sendo atualizada |
| **aria-current** | Indica item atual em navegação/processo |

### 6.5 Gerenciamento de Foco

| Conceito | Descrição |
|----------|-----------|
| **Focus** | Estado do elemento atualmente recebendo input do teclado |
| **Focus Visible** | Indicador visual de foco (outline) |
| **Focus Order (Tab Order)** | Ordem em que elementos recebem foco via Tab |
| **tabindex="0"** | Adiciona elemento à ordem de tabulação natural |
| **tabindex="-1"** | Remove da ordem de tab, mas permite foco programático |
| **Focus Trap** | Técnica que mantém foco dentro de um container (modais) |
| **Focus Return** | Retornar foco ao elemento que abriu modal/drawer |
| **Skip Link** | Link oculto para pular navegação e ir ao conteúdo principal |

### 6.6 Outros Conceitos de Acessibilidade

| Conceito | Descrição |
|----------|-----------|
| **Alt Text** | Texto alternativo para imagens (`alt="descrição"`) |
| **Color Contrast** | Razão de contraste entre texto e fundo (mínimo 4.5:1 AA) |
| **Screen Reader** | Software que lê conteúdo da tela para usuários com deficiência visual |
| **Keyboard Navigation** | Navegação completa usando apenas teclado |
| **Touch Target** | Área mínima de toque (44x44px recomendado) |
| **Reduced Motion** | Preferência de sistema para reduzir animações |
| **High Contrast** | Modo de alto contraste do sistema |
| **WCAG** | Web Content Accessibility Guidelines (diretrizes de acessibilidade) |

---

## 7. Termos de Design System

### 7.1 Design Tokens

| Termo | Descrição |
|-------|-----------|
| **Design Token** | Decisão de design abstraída em variável reutilizável (cor, espaçamento, tipografia) |
| **Primitive Token** | Token de nível mais baixo com valor bruto (ex: `color-blue-500: #3B82F6`) |
| **Semantic Token** | Token com significado contextual (ex: `color-primary: {color-blue-500}`) |
| **Component Token** | Token específico de componente (ex: `button-bg-primary: {color-primary}`) |
| **Token Aliasing** | Referência de um token a outro para criar hierarquia |

### 7.2 Atomic Design

| Nível | Descrição |
|-------|-----------|
| **Tokens (Subatômico)** | Variáveis de design fundamentais - cores, fontes, espaçamentos |
| **Atoms (Átomos)** | Elementos UI básicos e indivisíveis - botões, inputs, labels, ícones |
| **Molecules (Moléculas)** | Grupos de átomos funcionando juntos - campo de busca, card de produto |
| **Organisms (Organismos)** | Seções complexas compostas de moléculas - header, sidebar, formulário completo |
| **Templates** | Layouts de página definindo estrutura e posicionamento |
| **Pages (Páginas)** | Templates com conteúdo real, representando a experiência final |

### 7.3 Conceitos de Componentização

| Termo | Descrição |
|-------|-----------|
| **Variant** | Variação de um componente (ex: button primary, secondary, ghost) |
| **Size** | Tamanhos disponíveis de componente (xs, sm, md, lg, xl) |
| **State** | Estados visuais do componente (default, hover, focus, disabled) |
| **Slot** | Área dentro de componente onde conteúdo pode ser inserido |
| **Composition** | Construção de componentes complexos a partir de componentes menores |
| **Props** | Propriedades que configuram o comportamento/aparência do componente |
| **Children** | Conteúdo filho passado para dentro do componente |

### 7.4 Tematização

| Termo | Descrição |
|-------|-----------|
| **Theme** | Conjunto de tokens que define aparência visual (light, dark, brand) |
| **Light Mode** | Tema com fundo claro e texto escuro |
| **Dark Mode** | Tema com fundo escuro e texto claro |
| **CSS Custom Properties (Variables)** | Variáveis CSS nativas (`--color-primary`) |
| **Theme Provider** | Componente que fornece contexto de tema para aplicação |
| **Color Scheme** | Preferência de esquema de cores do sistema |

### 7.5 Documentação e Governança

| Termo | Descrição |
|-------|-----------|
| **Design System** | Coleção de componentes, padrões e diretrizes reutilizáveis |
| **Component Library** | Biblioteca de código com componentes implementados |
| **Pattern Library** | Coleção de padrões de design e uso |
| **Style Guide** | Documentação de estilos visuais e diretrizes de marca |
| **Storybook** | Ferramenta para documentar e testar componentes isoladamente |
| **API Documentation** | Documentação das props e configurações de componentes |

---

## 8. Unidades CSS

### 8.1 Unidades Absolutas

| Unidade | Descrição |
|---------|-----------|
| **px** | Pixel CSS - unidade mais comum, 1px = 1/96 de polegada |
| **pt** | Point - 1pt = 1/72 de polegada (comum em impressão) |
| **cm/mm/in** | Centímetros, milímetros, polegadas - unidades físicas |

### 8.2 Unidades Relativas

| Unidade | Descrição |
|---------|-----------|
| **em** | Relativo ao font-size do elemento pai |
| **rem** | Relativo ao font-size do elemento root (html) |
| **%** | Porcentagem do elemento pai |
| **vw** | 1% da largura do viewport |
| **vh** | 1% da altura do viewport |
| **vmin** | 1% da menor dimensão do viewport |
| **vmax** | 1% da maior dimensão do viewport |
| **dvh/dvw** | Dynamic viewport height/width (considera barra de endereço mobile) |
| **svh/svw** | Small viewport height/width |
| **lvh/lvw** | Large viewport height/width |
| **ch** | Largura do caractere "0" da fonte atual |
| **ex** | Altura do caractere "x" da fonte atual |
| **lh** | Line-height do elemento |
| **fr** | Fração do espaço disponível (CSS Grid) |

### 8.3 Funções CSS

| Função | Descrição |
|--------|-----------|
| **calc()** | Permite cálculos matemáticos misturando unidades |
| **min()** | Retorna o menor valor entre os argumentos |
| **max()** | Retorna o maior valor entre os argumentos |
| **clamp()** | Define valor com mínimo, preferido e máximo: `clamp(min, preferred, max)` |
| **var()** | Acessa valor de CSS custom property |

---

## 9. Media Queries e Responsividade

### 9.1 Breakpoints Comuns

| Dispositivo | Largura |
|-------------|---------|
| **Mobile S** | 320px |
| **Mobile M** | 375px |
| **Mobile L** | 425px |
| **Tablet** | 768px |
| **Laptop** | 1024px |
| **Desktop** | 1440px |
| **4K** | 2560px |

### 9.2 Media Features

| Feature | Descrição |
|---------|-----------|
| **min-width / max-width** | Largura mínima/máxima do viewport |
| **min-height / max-height** | Altura mínima/máxima do viewport |
| **orientation** | Orientação do dispositivo (portrait/landscape) |
| **prefers-color-scheme** | Preferência de tema do usuário (light/dark) |
| **prefers-reduced-motion** | Preferência por menos animações |
| **prefers-contrast** | Preferência de contraste |
| **hover** | Capacidade de hover (none para touch) |
| **pointer** | Precisão do dispositivo apontador (coarse/fine) |
| **aspect-ratio** | Proporção do viewport |

### 9.3 Container Queries

| Conceito | Descrição |
|----------|-----------|
| **Container Query** | Media query baseada no tamanho do container, não do viewport |
| **container-type** | Define elemento como container de consulta (inline-size, size) |
| **@container** | At-rule para definir estilos baseados no container |
| **Container Units** | Unidades relativas ao container (cqw, cqh, cqi, cqb) |

---

## Conclusão

Este glossário abrange os conceitos técnicos fundamentais para o módulo "UI & Glossário", fornecendo uma base sólida para desenvolvedores web que buscam dominar o desenvolvimento Pixel Perfect. Os termos foram organizados em categorias para facilitar a consulta e o aprendizado progressivo.

A compreensão desses conceitos é essencial para:
- Comunicação eficaz entre designers e desenvolvedores
- Implementação precisa de interfaces de acordo com especificações de design
- Criação de experiências acessíveis e responsivas
- Trabalho com design systems modernos

---

## Fontes

- [UX Design Institute - Complete UI Glossary](https://www.uxdesigninstitute.com/blog/ui-glossary/)
- [CareerFoundry - 32 UI Elements Guide 2025](https://careerfoundry.com/en/blog/ui-design/ui-element-glossary/)
- [Nielsen Norman Group - UI Elements Glossary](https://www.nngroup.com/articles/ui-elements-glossary/)
- [MDN Web Docs - CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN Web Docs - ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles)
- [CSS-Tricks - Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS-Tricks - Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [web.dev - Learn Accessibility](https://web.dev/learn/accessibility/)
- [Brad Frost - Atomic Design](https://bradfrost.com/blog/post/design-tokens-atomic-design-%E2%9D%A4%EF%B8%8F/)
- [Josh W. Comeau - CSS Color Formats](https://www.joshwcomeau.com/css/color-formats/)
- [Josh W. Comeau - Stacking Contexts](https://www.joshwcomeau.com/css/stacking-contexts/)
- [BrowserStack - Responsive Design Breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints)
- [W3C - WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)
- [The A11Y Project - ARIA Roles Guide](https://www.a11yproject.com/posts/an-indepth-guide-to-aria-roles/)
- [UX Patterns - Lazy Loading](https://uxpatterns.dev/glossary/l/lazy-loading)
- [Design Systems Collective - Atomic Design and Design Tokens](https://www.designsystemscollective.com/)

---

**Relatório compilado por:** The Veritas - Motor de Pesquisa eximIA.OS
**Data:** 31 de Janeiro de 2026
**Versão:** 1.0
