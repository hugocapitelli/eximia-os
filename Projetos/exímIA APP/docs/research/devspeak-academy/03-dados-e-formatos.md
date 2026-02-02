# Relatório Completo: Dados e Formatos para Desenvolvedores Web

## Sumário Executivo

Este documento apresenta todos os conceitos técnicos que devem ser abordados em um módulo de aprendizado sobre "Dados e Formatos" para desenvolvedores web. O conteúdo foi organizado em 8 categorias principais, cobrindo desde formatos de dados até otimização de imagens e estratégias de data fetching.

---

## 1. FORMATOS DE DADOS

### 1.1 JSON (JavaScript Object Notation)
- **Definição**: Formato de texto padrão baseado na sintaxe de objetos JavaScript, utilizado para representar dados estruturados
- **Características**: Leve, legível por humanos, independente de linguagem
- **Uso principal**: Transmissão de dados entre servidor e cliente em aplicações web
- **Estatística**: Mais de 70% das APIs públicas utilizam JSON como formato primário

### 1.2 XML (eXtensible Markup Language)
- **Definição**: Linguagem de marcação extensível para armazenar e transportar dados
- **Características**: Hierárquico, auto-descritivo, suporta namespaces
- **Desvantagem**: 30-40% maior que JSON devido às tags de fechamento
- **Uso**: Legado, configurações complexas, integração com sistemas antigos

### 1.3 YAML (YAML Ain't Markup Language)
- **Definição**: Superset de JSON focado em legibilidade humana
- **Características**: Baseado em indentação, suporta comentários, referências (anchors)
- **Uso comum**: Kubernetes, Ansible, GitHub Actions, Docker Compose
- **Cuidado**: Indentação estrita pode causar erros difíceis de depurar

### 1.4 TOML (Tom's Obvious, Minimal Language)
- **Definição**: Formato de configuração minimalista e fácil de ler
- **Características**: Tipagem explícita, suporte nativo a datas/horas, não depende de indentação
- **Uso principal**: pyproject.toml (Python), cargo.toml (Rust), configurações de ferramentas
- **Vantagem**: Parsing previsível sem surpresas baseadas em contexto

### 1.5 CSV (Comma-Separated Values)
- **Definição**: Formato simples para representar dados tabulares bidimensionais
- **Características**: Valores separados por vírgula, sem suporte a comentários
- **Uso**: Exportação de planilhas, dados tabulares simples
- **Limitação**: Não suporta dados hierárquicos

### 1.6 Protocol Buffers (Protobuf)
- **Definição**: Formato de serialização binária compacta desenvolvido pelo Google
- **Características**: Requer schema (.proto), alta performance, tipagem forte
- **Uso**: gRPC, comunicação entre microserviços, aplicações de alta performance
- **Vantagem**: Não transmite nomes de campos, resultando em payloads menores que MessagePack

### 1.7 MessagePack
- **Definição**: Formato de serialização binária eficiente ("JSON binário")
- **Características**: Sem necessidade de schema, compatível com estrutura JSON
- **Vantagem**: Setup mínimo, suporte a múltiplas linguagens
- **Economia**: Pode reduzir custos de Lambda em até 25% comparado a JSON

---

## 2. CONCEITOS DE JSON

### 2.1 Estruturas Fundamentais
- **Objetos**: Coleções de pares chave-valor delimitados por `{}`
- **Arrays**: Listas ordenadas de valores delimitadas por `[]`
- **Pares chave-valor**: Formato `"chave": valor`
- **Aninhamento (Nesting)**: Objetos e arrays dentro de objetos e arrays

### 2.2 Tipos de Dados JSON
- **String**: Texto entre aspas duplas
- **Number**: Números inteiros ou decimais
- **Boolean**: `true` ou `false`
- **Null**: Valor nulo (`null`)
- **Object**: Objeto aninhado
- **Array**: Lista de valores

### 2.3 Métodos JavaScript
- **JSON.parse()**: Converte string JSON em objeto JavaScript
- **JSON.stringify()**: Converte objeto JavaScript em string JSON

### 2.4 JSON Schema
- **Definição**: Vocabulário para validar estrutura e tipos de dados JSON
- **Uso**: Validação de dados, documentação de APIs, geração de código
- **Patrocinadores 2025**: Airbnb, Postman, AsyncAPI
- **Ferramenta**: pajv (Polyglottal JSON Schema Validator)

### 2.5 Variantes de JSON
- **JSON5**: Suporta comentários, trailing commas, chaves sem aspas, strings multilinhas
- **JSONC (JSON with Comments)**: JSON com suporte a comentários `//` e `/* */`
  - Usado pelo VS Code para arquivos de configuração
- **HJSON (Human JSON)**: Sintaxe ainda mais relaxada, ecossistema de nicho

### 2.6 Boas Práticas
- Usar formatos padrão (JSON, YAML, XML) a menos que haja razão específica
- Validar com JSON Schema ou zod antes de publicar APIs
- JSON5/JSONC apenas para configs; releases devem usar JSON estrito

---

## 3. CONCEITOS DE API

### 3.1 Tipos de Arquitetura de API

#### REST (Representational State Transfer)
- **Definição**: Interface baseada em HTTP para comunicação cliente-servidor
- **Características**: Stateless, cacheable, interface uniforme
- **Uso**: APIs web, aplicações móveis, microserviços
- **Limitações**: Over-fetching, under-fetching, desafios de versionamento

#### GraphQL
- **Definição**: Linguagem de query para APIs desenvolvida pelo Facebook (2012)
- **Características**: Endpoint único, cliente especifica campos necessários, tipado por schema
- **Operações**: Queries (leitura), Mutations (escrita), Subscriptions (streaming)
- **Vantagem**: Evita over-fetching e under-fetching

#### SOAP (Simple Object Access Protocol)
- **Definição**: Protocolo de troca de informações baseado em XML
- **Características**: Suporta múltiplos protocolos de transporte (HTTP, SMTP, TCP)
- **Uso**: Aplicações enterprise, transações bancárias, operações stateful

#### RPC (Remote Procedure Call)
- **JSON-RPC / XML-RPC**: Protocolos leves de chamada remota
- **gRPC**: Versão moderna desenvolvida pelo Google (2015)
  - Usa Protocol Buffers sobre HTTP/2
  - Suporte a streaming bidirecional
  - Ideal para comunicação entre microserviços

### 3.2 Métodos HTTP
| Método | Descrição | Idempotente |
|--------|-----------|-------------|
| GET | Recuperar recurso | Sim |
| POST | Criar novo recurso | Não |
| PUT | Substituir recurso completamente | Sim |
| PATCH | Atualizar parcialmente | Não |
| DELETE | Remover recurso | Sim |

**Regra importante**: NUNCA use GET para operações que modificam dados

### 3.3 Códigos de Status HTTP

#### 1xx - Informacional
- **100 Continue**: Servidor recebeu headers, cliente pode continuar

#### 2xx - Sucesso
- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Sucesso sem corpo de resposta (deletions)

#### 3xx - Redirecionamento
- **301 Moved Permanently**: Recurso movido permanentemente
- **302 Found**: Redirecionamento temporário
- **304 Not Modified**: Recurso não modificado (cache)

#### 4xx - Erro do Cliente
- **400 Bad Request**: Sintaxe inválida, JSON malformado, campos obrigatórios ausentes
- **401 Unauthorized**: Autenticação necessária ou inválida
- **403 Forbidden**: Autenticado mas sem permissão
- **404 Not Found**: Recurso não encontrado
- **429 Too Many Requests**: Rate limit excedido

#### 5xx - Erro do Servidor
- **500 Internal Server Error**: Erro genérico do servidor
- **502 Bad Gateway**: Gateway inválido
- **503 Service Unavailable**: Serviço temporariamente indisponível

### 3.4 Componentes de Requisição/Resposta
- **Headers**: Metadados da requisição (Content-Type, Authorization, Accept)
- **Request Body**: Corpo da requisição (JSON, FormData)
- **Response Body**: Corpo da resposta
- **Query Params**: Parâmetros na URL (`?key=value&key2=value2`)
- **Path Params**: Parâmetros na rota (`/users/:id`)

### 3.5 Autenticação

#### Basic Auth
- Usuário e senha codificados em Base64
- Simples mas menos seguro

#### API Keys
- Chave única passada no header
- Adequado para comunicação servidor-servidor
- Não deve ser única camada de segurança para operações sensíveis

#### JWT (JSON Web Tokens)
- Tokens auto-contidos com informações do usuário
- Reduz consultas ao banco de dados
- Suporta expiração temporal

#### OAuth 2.0
- Padrão para autorização delegada
- Bearer tokens com tempo limitado
- Suporte a escopos (scope restrictions)

### 3.6 Controle de Tráfego

#### Rate Limiting
- Limite de requisições por período
- Previne abuso e ataques de força bruta
- Retorna 429 quando excedido

#### Pagination

**Offset Pagination**
- Parâmetros: `?offset=20&limit=10`
- Simples de implementar
- Limitação: Performance degrada com offsets grandes
- Limite típico: 100 páginas / 10.000 recursos

**Cursor-Based Pagination**
- Usa marcador codificado apontando para último item
- Performance constante independente do tamanho do dataset
- Ideal para feeds, infinite scroll, dados em tempo real
- Permite apenas navegação sequencial (próximo/anterior)

---

## 4. FORMATOS DE IMAGEM

### 4.1 Formatos Raster (Bitmap)

#### PNG (Portable Network Graphics)
- **Compressão**: Lossless (sem perda)
- **Transparência**: Suporte total (alpha channel)
- **Uso ideal**: Logos, ícones, gráficos com bordas nítidas, imagens com texto
- **Desvantagem**: Arquivos maiores que JPEG para fotos

#### JPG/JPEG (Joint Photographic Experts Group)
- **Compressão**: Lossy (com perda)
- **Transparência**: Não suportada
- **Uso ideal**: Fotografias, imagens com gradientes suaves
- **Estatística**: 74% dos websites usam JPEG em 2025
- **Desvantagem**: Artefatos visíveis em compressão alta

#### GIF (Graphics Interchange Format)
- **Compressão**: Lossless (limitado a 256 cores)
- **Transparência**: Suporte binário (sem gradiente)
- **Animação**: Suportada
- **Uso**: Animações simples, memes, imagens com poucas cores

#### WebP
- **Desenvolvedor**: Google
- **Compressão**: Lossy e lossless
- **Transparência**: Suportada
- **Animação**: Suportada
- **Economia**: 25-34% menor que JPEG com qualidade equivalente
- **Suporte 2025**: Todos os navegadores modernos

#### AVIF (AV1 Image File Format)
- **Compressão**: Lossy e lossless (baseado no codec AV1)
- **Transparência**: Suportada
- **HDR**: Suportado (10/12-bit)
- **Economia**: ~50% menor que JPEG
- **Desvantagem**: Encoding mais lento, sem progressive rendering
- **Suporte 2025**: Chrome, Edge, Firefox, Opera, Safari

### 4.2 Formato Vetorial

#### SVG (Scalable Vector Graphics)
- **Definição**: Gráficos vetoriais baseados em XML
- **Escala**: Infinita, nítido em qualquer resolução
- **Tamanho**: Extremamente leve para gráficos simples
- **Manipulação**: Estilizável via CSS, animável via CSS/JS
- **Uso ideal**: Logos, ícones, ilustrações, infográficos, animações web
- **Última versão**: Draft lançado em setembro 2025

### 4.3 Favicon

#### ICO (Icon)
- **Definição**: Formato container que pode conter múltiplos tamanhos
- **Tamanhos mínimos**: 16x16, 32x32, 48x48
- **Localização**: Raiz do website (`/favicon.ico`)

#### Configuração Moderna de Favicon (2025)
```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180x180 -->
<link rel="manifest" href="/manifest.webmanifest">
```

---

## 5. OTIMIZAÇÃO DE IMAGENS

### 5.1 Técnicas de Compressão
- **Lossy**: Reduz tamanho com perda aceitável de qualidade
- **Lossless**: Reduz tamanho sem perder qualidade
- **CRF (Constant Rate Factor)**: Valores 18-23 para H.264 (60-80% redução)
- **Quality Settings**: Ajuste de qualidade (0-100) em ferramentas de compressão

### 5.2 Lazy Loading
- **Definição**: Carregamento adiado de imagens abaixo da dobra (below-the-fold)
- **Implementação**: `loading="lazy"` no atributo img
- **Regra**: Imagens above-the-fold devem carregar eagerly

### 5.3 Imagens Responsivas

#### srcset
- **Definição**: Lista de fontes de imagem com diferentes resoluções
- **Sintaxe**: `srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"`

#### sizes
- **Definição**: Indica ao navegador o tamanho de exibição da imagem
- **Sintaxe**: `sizes="(max-width: 600px) 100vw, 50vw"`

#### Elemento `<picture>`
- **Uso**: Art direction (diferentes imagens para diferentes contextos)
- **Fallback**: Permite servir AVIF > WebP > JPEG

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Descrição">
</picture>
```

### 5.4 Image CDN
- **Cloudinary**: APIs extensivas, múltiplos CDNs (Akamai, Fastly, CloudFront), transformações avançadas
- **imgix**: Compressão dinâmica, conversão automática para WebP
- **Vercel Image Optimization**: Focado em otimização, integrado ao Next.js, cache em edge servers

### 5.5 Next.js Image Component
- **Geração automática de srcset**: Múltiplos tamanhos otimizados
- **Lazy loading por padrão**: Apenas imagens visíveis são carregadas
- **Suporte a AVIF/WebP**: Configurável via next.config.js
- **Blur placeholder**: Placeholder de baixa resolução durante carregamento
- **Integração com CDNs externos**: Cloudinary, imgix via loaders customizados

### 5.6 Outras Otimizações
- **Aspect Ratio**: Definir proporção previne layout shift (CLS)
- **Preload**: `<link rel="preload">` para imagens críticas
- **Image Subsetting**: Remover dados EXIF desnecessários

---

## 6. OUTROS FORMATOS DE ARQUIVO

### 6.1 Fontes Web

| Formato | Descrição | Compressão | Suporte 2025 |
|---------|-----------|------------|--------------|
| WOFF2 | Web Open Font Format 2.0 | Brotli (~30% melhor) | 97%+ navegadores |
| WOFF | Web Open Font Format | zlib | Universal |
| TTF | TrueType Font | Nenhuma | Universal (desktop) |
| OTF | OpenType Font | Nenhuma | Universal (desktop) |
| EOT | Embedded OpenType | Nenhuma | IE apenas |

**Recomendação 2025**: WOFF2 como único formato necessário para navegadores modernos

#### Otimização de Fontes
- **Preload**: `<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>`
- **font-display**: `swap` (mostra fallback imediatamente), `optional` (fallback se lento)
- **Font Subsetting**: Remover caracteres não utilizados (pode reduzir de 95kb para 16kb)
- **local()**: Verificar se usuário já tem fonte instalada localmente

### 6.2 Video

| Formato | Codec | Uso | Suporte |
|---------|-------|-----|---------|
| MP4 | H.264 | Universal, compatibilidade máxima | Todos navegadores |
| MP4 | H.265/HEVC | 4K/HDR, melhor compressão | Limitado |
| WebM | VP9 | Web otimizado, compressão superior | Chrome, Firefox, Edge |
| WebM | AV1 | Melhor compressão, futuro | Chrome, Firefox, Edge |

**Estratégia recomendada**: Servir WebM (VP9) + MP4 (H.265) cobre 94% dos usuários

**Resolução**: 720p (1280x720) melhor balanço qualidade/tamanho para web (65% do consumo é mobile)

### 6.3 Áudio

| Formato | Tipo | Uso |
|---------|------|-----|
| MP3 | Lossy | Universal, streaming |
| AAC | Lossy | Melhor qualidade que MP3 |
| OGG (Vorbis) | Lossy | Open source, web |
| WAV | Lossless | Edição, alta qualidade |
| FLAC | Lossless | Arquivamento |

### 6.4 Documentos
- **PDF**: Portable Document Format - documentos formatados, relatórios
- **Markdown (.md)**: Documentação, README files

---

## 7. DATA FETCHING

### 7.1 Fetch API Nativa
- **Definição**: API padrão do navegador para requisições HTTP
- **Características**: Promise-based, suporte a streaming
- **Uso básico**: `fetch(url, options).then(res => res.json())`

### 7.2 Axios
- **Definição**: Biblioteca HTTP client baseada em promises
- **Vantagens sobre fetch**: Interceptors, transformação automática de JSON, cancelamento de requisições, timeout configuration

### 7.3 SWR (Stale-While-Revalidate)
- **Desenvolvedor**: Vercel (equipe do Next.js)
- **Estratégia**: Serve dados do cache enquanto revalida em background
- **Características**: Leve, TypeScript-ready, setup mínimo
- **Uso ideal**: Casos simples, real-time fetching com configuração mínima

### 7.4 TanStack Query (React Query)
- **Histórico**: Criado como React Query em 2019, renomeado em 2022 para suportar múltiplos frameworks
- **Características**: DevTools, controle granular de cache, suporte a paginação/infinite queries
- **Uso ideal**: Aplicações complexas, dados com dependências, mutations sofisticadas
- **v5+**: Melhor suporte a RSC (React Server Components) e Suspense

### 7.5 Comparação TanStack Query vs SWR
| Aspecto | TanStack Query | SWR |
|---------|---------------|-----|
| Complexidade | Mais configuração | Minimal setup |
| DevTools | Incluído | Não oficial |
| Paginação | Suporte nativo | Limitado |
| Comunidade | Maior | Menor |
| Uso ideal | Apps complexas | Apps simples |

### 7.6 Server Components Data Fetching (2026)
- **Arquitetura Híbrida**: RSC para carga inicial + TanStack Query para interatividade
- **Benefício**: 40-70% mais rápido em initial load
- **Padrão comum**: Next.js 15+ e TanStack Start

### 7.7 Estratégias de Caching
- **Stale Time**: Tempo que dados são considerados frescos
- **Cache Time**: Tempo que dados permanecem em cache
- **Revalidation**: Estratégias de atualização (on-focus, on-reconnect, interval)
- **Invalidation**: Invalidar cache após mutations

---

## 8. SERIALIZAÇÃO E DESERIALIZAÇÃO

### 8.1 Conceitos Fundamentais
- **Serialização**: Converter objeto/estrutura em formato transmissível (string, bytes)
- **Deserialização**: Reconstruir objeto a partir do formato serializado
- **Encoding**: Representar dados em formato específico
- **Decoding**: Reverter encoding para formato original

### 8.2 Base64
- **Definição**: Esquema de codificação para representar dados binários em texto ASCII
- **Uso**: Transmitir dados binários sobre protocolos de texto, armazenar em JSON/XML
- **JavaScript**:
  - `btoa()`: Codifica string para Base64
  - `atob()`: Decodifica Base64 para string

#### Base64URL
- **Diferença**: Substitui `+` por `-` e `/` por `_`, omite padding `=`
- **Uso**: URLs, filenames (RFC 4648)

### 8.3 URL Encoding (Percent-Encoding)
- **Definição**: Codificar caracteres especiais em URIs usando `%XX`
- **Caracteres não codificados**: A-Z, a-z, 0-9, `-`, `_`, `.`, `~`

#### encodeURI() vs encodeURIComponent()
| Função | Uso | Codifica ? e & |
|--------|-----|----------------|
| encodeURI() | URI completa | Não |
| encodeURIComponent() | Componentes (params) | Sim |

**Regra**: SEMPRE use `encodeURIComponent()` para query parameters

#### Decodificação
- `decodeURI()` / `decodeURIComponent()`
- Sempre envolver em try/catch para tratar URIs malformadas
- Usar `URLSearchParams` para manipulação robusta

### 8.4 FormData
- **Definição**: Interface para construir conjuntos chave/valor para envio via fetch/XHR
- **Formato**: `multipart/form-data`
- **Uso principal**: Upload de arquivos

#### Regra Crítica
**NÃO defina o header Content-Type manualmente ao usar FormData!**
O navegador precisa definir automaticamente para incluir o boundary correto.

```javascript
// CORRETO
const formData = new FormData();
formData.append('file', file);
fetch(url, { method: 'POST', body: formData });

// ERRADO - Não faça isso!
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' }, // NÃO!
  body: formData
});
```

### 8.5 Multipart/form-data
- **Definição**: Formato para transmissão de dados binários via HTTP
- **Boundary**: Delimitador entre campos (similar a `&` em query strings)
- **Servidor**: Use bibliotecas como Multer (Node.js) para processar

### 8.6 Segurança em Deserialização
- **Risco**: Deserialização de dados não confiáveis pode causar RCE (Remote Code Execution)
- **Boas práticas**:
  - Usar formatos seguros (JSON via JSON.parse)
  - Nunca deserializar dados de fontes não confiáveis com BinaryFormatter (.NET)
  - Validar schema antes de processar

---

## Fontes de Pesquisa

- [MDN Web Docs - JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
- [JSON vs XML vs YAML - Orbit2x](https://orbit2x.com/blog/json-vs-xml-vs-yaml)
- [REST API Complete Guide 2025 - Knowi](https://www.knowi.com/blog/rest-api-complete-guide-from-concepts-to-implementation-2025/)
- [HTTP Status Codes - REST API Tutorial](https://restfulapi.net/http-status-codes/)
- [REST API Authentication Guide - Knowi](https://www.knowi.com/blog/4-ways-of-rest-api-authentication-methods/)
- [Best Web Image Format 2026 - The CSS Agency](https://www.thecssagency.com/blog/best-web-image-format)
- [Image Optimization 2025 - AI Bud](https://aibudwp.com/image-optimization-in-2025-webp-avif-srcset-and-preload/)
- [TanStack Query vs SWR 2025 - Refine](https://refine.dev/blog/react-query-vs-tanstack-query-vs-swr-2025/)
- [React Server Components + TanStack Query 2026 - DEV Community](https://dev.to/krish_kakadiya_5f0eaf6342/react-server-components-tanstack-query-the-2026-data-fetching-power-duo-you-cant-ignore-21fj)
- [API Types Guide 2026 - DEV Community](https://dev.to/sizan_mahmud0_e7c3fd0cb68/the-complete-guide-to-api-types-in-2026-rest-graphql-grpc-soap-and-beyond-191)
- [JSON vs YAML vs TOML 2025 - DEV Community](https://dev.to/leapcell/json-vs-yaml-vs-toml-vs-xml-best-data-format-in-2025-5444)
- [Using FormData Objects - MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects)
- [Optimize Web Fonts - web.dev](https://web.dev/learn/performance/optimize-web-fonts)
- [Next.js Image Component - Next.js Docs](https://nextjs.org/docs/app/api-reference/components/image)
- [Protocol Buffers vs MessagePack - CloudThat](https://www.cloudthat.com/resources/blog/optimizing-api-performance-with-protocol-buffers-flatbuffers-messagepack-and-cbor)
- [JSON5 - JSON for Humans](https://json5.org/)
- [SVG Complete Guide - SVG Genie](https://www.svggenie.com/blog/svg-complete-guide)
- [Web Video Codec Guide - MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs)
- [API Pagination Guide - DEV Community](https://dev.to/reclusivecoder/a-developers-guide-to-api-pagination-offset-vs-cursor-based-2m5h)
- [How to Favicon in 2025 - Evil Martians](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)
- [encodeURIComponent - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization)

---

**Documento compilado por The Veritas - Research Engine**
**Data**: 2026-01-31
**Versão**: 1.0
