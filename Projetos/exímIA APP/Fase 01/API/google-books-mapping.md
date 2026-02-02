# Mapeamento de APIs Externas — Módulo Biblioteca

> Fase 01 | Version 1.0.0 | 2026-02-01

---

## 1. Google Books API

### 1.1 Visão Geral

| Item | Valor |
|------|-------|
| Base URL | `https://www.googleapis.com/books/v1` |
| Autenticação | API Key (query param) |
| Rate Limit | 1.000 requests/dia (free) |
| Documentação | https://developers.google.com/books/docs/v1/using |

### 1.2 Endpoint de Busca

```
GET /volumes?q={query}&key={API_KEY}&maxResults=10&langRestrict=pt
```

**Query Parameters:**

| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `q` | string | Sim | Termo de busca |
| `key` | string | Sim | API Key |
| `maxResults` | number | Não | Máximo de resultados (1-40, default 10) |
| `langRestrict` | string | Não | Restringe por idioma (pt, en, etc.) |
| `startIndex` | number | Não | Offset para paginação |
| `printType` | string | Não | `books`, `magazines`, ou `all` |
| `orderBy` | string | Não | `relevance` ou `newest` |

**Modificadores de Query:**

| Modificador | Exemplo | Descrição |
|-------------|---------|-----------|
| `intitle:` | `intitle:trabalho profundo` | Busca no título |
| `inauthor:` | `inauthor:cal newport` | Busca por autor |
| `isbn:` | `isbn:9788532530790` | Busca por ISBN |
| `subject:` | `subject:produtividade` | Busca por categoria |

### 1.3 Response Schema

```typescript
interface GoogleBooksResponse {
  kind: "books#volumes";
  totalItems: number;
  items?: GoogleBooksVolume[];
}

interface GoogleBooksVolume {
  kind: "books#volume";
  id: string;  // ← google_books_id
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
}

interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;  // "2016" ou "2016-01-15"
  description?: string;    // HTML encoded
  industryIdentifiers?: IndustryIdentifier[];
  pageCount?: number;
  categories?: string[];
  averageRating?: number;  // 1-5
  ratingsCount?: number;
  maturityRating?: "NOT_MATURE" | "MATURE";
  imageLinks?: ImageLinks;
  language?: string;       // ISO 639-1 (pt, en, es)
  previewLink?: string;
  infoLink?: string;
}

interface IndustryIdentifier {
  type: "ISBN_10" | "ISBN_13" | "ISSN" | "OTHER";
  identifier: string;
}

interface ImageLinks {
  smallThumbnail?: string;  // ~80x128
  thumbnail?: string;       // ~128x192
  small?: string;           // ~300x450
  medium?: string;          // ~575x800
  large?: string;           // ~800x1200
  extraLarge?: string;      // Original size
}
```

### 1.4 Mapeamento para Schema Local

| Google Books Field | Local Field | Transformação |
|--------------------|-------------|---------------|
| `id` | `google_books_id` | Direto |
| `volumeInfo.title` | `title` | Direto |
| `volumeInfo.authors[0]` | `author` (criar/vincular) | Primeiro autor |
| `volumeInfo.description` | `description` | Decode HTML entities |
| `volumeInfo.publisher` | `publisher` | Direto |
| `volumeInfo.publishedDate` | `published_date` | Parse para Date |
| `volumeInfo.pageCount` | `page_count` | Direto |
| `volumeInfo.categories` | `categories` | Array direto |
| `volumeInfo.language` | `language` | Direto |
| `industryIdentifiers[ISBN_10]` | `isbn10` | Filtrar por type |
| `industryIdentifiers[ISBN_13]` | `isbn13` | Filtrar por type |
| `imageLinks.large` | `cover_url` | Download + upload |
| `imageLinks.thumbnail` | `thumbnail_url` | Backup URL |

### 1.5 Código de Integração

```typescript
// lib/services/google-books.ts

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

interface SearchOptions {
  maxResults?: number;
  langRestrict?: string;
  startIndex?: number;
}

export async function searchGoogleBooks(
  query: string,
  options: SearchOptions = {}
): Promise<BookSearchResult[]> {
  const { maxResults = 10, langRestrict = 'pt', startIndex = 0 } = options;

  const params = new URLSearchParams({
    q: query,
    key: process.env.GOOGLE_BOOKS_API_KEY!,
    maxResults: maxResults.toString(),
    langRestrict,
    startIndex: startIndex.toString(),
  });

  const response = await fetch(
    `${GOOGLE_BOOKS_BASE_URL}/volumes?${params}`
  );

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`);
  }

  const data: GoogleBooksResponse = await response.json();

  if (!data.items) {
    return [];
  }

  return data.items.map(mapGoogleBookToSearchResult);
}

export async function getGoogleBookById(
  volumeId: string
): Promise<BookSearchResult | null> {
  const response = await fetch(
    `${GOOGLE_BOOKS_BASE_URL}/volumes/${volumeId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Google Books API error: ${response.status}`);
  }

  const volume: GoogleBooksVolume = await response.json();
  return mapGoogleBookToSearchResult(volume);
}

function mapGoogleBookToSearchResult(
  volume: GoogleBooksVolume
): BookSearchResult {
  const { volumeInfo } = volume;

  // Extrair ISBNs
  const isbn10 = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === 'ISBN_10'
  )?.identifier;

  const isbn13 = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === 'ISBN_13'
  )?.identifier;

  // Obter melhor capa disponível
  const coverUrl =
    volumeInfo.imageLinks?.large ||
    volumeInfo.imageLinks?.medium ||
    volumeInfo.imageLinks?.small ||
    volumeInfo.imageLinks?.thumbnail;

  return {
    externalId: volume.id,
    source: 'google',
    title: volumeInfo.title,
    authors: volumeInfo.authors || ['Autor Desconhecido'],
    description: decodeHtmlEntities(volumeInfo.description || ''),
    coverUrl: coverUrl?.replace('http://', 'https://'),
    thumbnailUrl: volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://'),
    isbn10,
    isbn13,
    publisher: volumeInfo.publisher,
    publishedDate: volumeInfo.publishedDate,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    language: volumeInfo.language,
  };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
}
```

### 1.6 Exemplos de Request/Response

**Request:**
```
GET https://www.googleapis.com/books/v1/volumes?q=trabalho+profundo&key=AIza...&maxResults=3&langRestrict=pt
```

**Response:**
```json
{
  "kind": "books#volumes",
  "totalItems": 127,
  "items": [
    {
      "id": "ZHVHDwAAQBAJ",
      "volumeInfo": {
        "title": "Trabalho Focado",
        "subtitle": "Como ter sucesso em um mundo distraído",
        "authors": ["Cal Newport"],
        "publisher": "Alta Books",
        "publishedDate": "2017-11-13",
        "description": "O trabalho profundo é a capacidade de focar...",
        "industryIdentifiers": [
          { "type": "ISBN_13", "identifier": "9788550803647" },
          { "type": "ISBN_10", "identifier": "8550803642" }
        ],
        "pageCount": 280,
        "categories": ["Business & Economics"],
        "language": "pt",
        "imageLinks": {
          "thumbnail": "http://books.google.com/books/content?id=ZHVHDwAAQBAJ&printsec=frontcover&img=1&zoom=1"
        }
      }
    }
  ]
}
```

---

## 2. Open Library API (Fallback)

### 2.1 Visão Geral

| Item | Valor |
|------|-------|
| Base URL | `https://openlibrary.org` |
| Autenticação | Nenhuma (público) |
| Rate Limit | Ilimitado (fair use) |
| Documentação | https://openlibrary.org/developers/api |

### 2.2 Endpoints

#### Search API
```
GET /search.json?q={query}&limit=10&language=por
```

#### Works API (detalhes)
```
GET /works/{work_id}.json
```

#### Covers API
```
GET https://covers.openlibrary.org/b/id/{cover_id}-L.jpg
GET https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg
```

### 2.3 Response Schema

```typescript
interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryDoc[];
}

interface OpenLibraryDoc {
  key: string;              // "/works/OL123W" → open_library_key
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  cover_i?: number;         // Cover ID for Covers API
  number_of_pages_median?: number;
  subject?: string[];
  language?: string[];
  edition_count?: number;
}
```

### 2.4 Mapeamento para Schema Local

| Open Library Field | Local Field | Transformação |
|--------------------|-------------|---------------|
| `key` | `open_library_key` | Extrair ID (/works/OL123W → OL123W) |
| `title` | `title` | Direto |
| `author_name[0]` | `author` | Primeiro autor |
| `publisher[0]` | `publisher` | Primeiro publisher |
| `first_publish_year` | `published_date` | Converter para YYYY-01-01 |
| `number_of_pages_median` | `page_count` | Direto |
| `subject` | `categories` | Limitar a 5 primeiros |
| `language[0]` | `language` | Primeiro idioma |
| `isbn[0]` (10 chars) | `isbn10` | Filtrar por length |
| `isbn[0]` (13 chars) | `isbn13` | Filtrar por length |
| `cover_i` | `cover_url` | Construir URL da Covers API |

### 2.5 Código de Integração

```typescript
// lib/services/open-library.ts

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org';

interface SearchOptions {
  limit?: number;
  language?: string;
}

export async function searchOpenLibrary(
  query: string,
  options: SearchOptions = {}
): Promise<BookSearchResult[]> {
  const { limit = 10, language = 'por' } = options;

  const params = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    language,
  });

  const response = await fetch(
    `${OPEN_LIBRARY_BASE_URL}/search.json?${params}`
  );

  if (!response.ok) {
    throw new Error(`Open Library API error: ${response.status}`);
  }

  const data: OpenLibrarySearchResponse = await response.json();

  return data.docs.map(mapOpenLibraryToSearchResult);
}

function mapOpenLibraryToSearchResult(
  doc: OpenLibraryDoc
): BookSearchResult {
  // Extrair ISBNs
  const isbns = doc.isbn || [];
  const isbn10 = isbns.find((isbn) => isbn.length === 10);
  const isbn13 = isbns.find((isbn) => isbn.length === 13);

  // Construir URL da capa
  let coverUrl: string | undefined;
  if (doc.cover_i) {
    coverUrl = `${COVERS_BASE_URL}/b/id/${doc.cover_i}-L.jpg`;
  } else if (isbn13) {
    coverUrl = `${COVERS_BASE_URL}/b/isbn/${isbn13}-L.jpg`;
  }

  return {
    externalId: doc.key.replace('/works/', ''),
    source: 'openLibrary',
    title: doc.title,
    authors: doc.author_name || ['Autor Desconhecido'],
    description: undefined, // Open Library não retorna descrição na busca
    coverUrl,
    thumbnailUrl: coverUrl?.replace('-L.jpg', '-M.jpg'),
    isbn10,
    isbn13,
    publisher: doc.publisher?.[0],
    publishedDate: doc.first_publish_year?.toString(),
    pageCount: doc.number_of_pages_median,
    categories: doc.subject?.slice(0, 5),
    language: doc.language?.[0],
  };
}

// Buscar descrição separadamente (se necessário)
export async function getOpenLibraryWorkDetails(
  workKey: string
): Promise<{ description?: string }> {
  const response = await fetch(
    `${OPEN_LIBRARY_BASE_URL}/works/${workKey}.json`
  );

  if (!response.ok) {
    return {};
  }

  const data = await response.json();

  // Descrição pode ser string ou objeto { value: string }
  const description = typeof data.description === 'string'
    ? data.description
    : data.description?.value;

  return { description };
}
```

---

## 3. Serviço Unificado de Busca

### 3.1 Estratégia de Fallback

```typescript
// lib/services/book-search.ts

import { searchGoogleBooks, getGoogleBookById } from './google-books';
import { searchOpenLibrary, getOpenLibraryWorkDetails } from './open-library';

export async function searchBooks(
  query: string,
  options: { maxResults?: number } = {}
): Promise<BookSearchResult[]> {
  const { maxResults = 10 } = options;

  try {
    // 1. Tentar Google Books primeiro
    const googleResults = await searchGoogleBooks(query, { maxResults });

    if (googleResults.length > 0) {
      return googleResults;
    }

    // 2. Fallback para Open Library
    console.log('Google Books sem resultados, tentando Open Library...');
    const openLibraryResults = await searchOpenLibrary(query, { limit: maxResults });

    return openLibraryResults;

  } catch (error) {
    console.error('Erro na busca Google Books:', error);

    // 3. Se Google falhar, tentar Open Library
    try {
      return await searchOpenLibrary(query, { limit: maxResults });
    } catch (fallbackError) {
      console.error('Erro no fallback Open Library:', fallbackError);
      throw new Error('Não foi possível buscar livros. Tente novamente.');
    }
  }
}

export async function getBookDetails(
  externalId: string,
  source: BookSearchSource
): Promise<BookSearchResult | null> {
  if (source === 'google') {
    return getGoogleBookById(externalId);
  } else {
    // Open Library - buscar detalhes do work
    const details = await getOpenLibraryWorkDetails(externalId);
    // Nota: precisaria combinar com dados da busca original
    return null; // Implementar conforme necessidade
  }
}
```

### 3.2 Cache de Resultados

```typescript
// lib/services/book-search-cache.ts

import { unstable_cache } from 'next/cache';

export const searchBooksWithCache = unstable_cache(
  async (query: string, maxResults: number) => {
    return searchBooks(query, { maxResults });
  },
  ['book-search'],
  {
    revalidate: 3600, // 1 hora
    tags: ['books'],
  }
);
```

---

## 4. Upload de Capas

### 4.1 Serviço de Upload

```typescript
// lib/services/cover-upload.ts

import { createClient } from '@/lib/supabase/server';

const BUCKET_NAME = 'book-covers';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadBookCover(
  bookId: string,
  userId: string,
  imageUrl: string
): Promise<string | null> {
  try {
    // 1. Baixar imagem da URL externa
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error('Falha ao baixar capa:', response.status);
      return null;
    }

    const blob = await response.blob();

    if (blob.size > MAX_SIZE) {
      console.error('Imagem muito grande:', blob.size);
      return null;
    }

    // 2. Determinar extensão
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.includes('png') ? 'png' : 'jpg';

    // 3. Upload para Supabase Storage
    const supabase = await createClient();
    const filePath = `${userId}/${bookId}.${extension}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Erro no upload:', error);
      return null;
    }

    // 4. Retornar URL pública
    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;

  } catch (error) {
    console.error('Erro ao processar capa:', error);
    return null;
  }
}
```

---

## 5. Variáveis de Ambiente

```env
# Google Books API
GOOGLE_BOOKS_API_KEY=AIzaSy...

# Feature Flags
OPEN_LIBRARY_FALLBACK_ENABLED=true
BOOK_COVER_UPLOAD_ENABLED=true

# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=book-covers
```

---

## 6. Rate Limiting & Error Handling

### 6.1 Tratamento de Erros

| Código | API | Significado | Ação |
|--------|-----|-------------|------|
| 400 | Google | Query inválida | Validar input |
| 403 | Google | API key inválida ou quota excedida | Fallback |
| 429 | Ambas | Rate limit | Retry com backoff |
| 500+ | Ambas | Erro do servidor | Fallback ou retry |

### 6.2 Retry com Exponential Backoff

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        // Rate limited - esperar e tentar novamente
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;

      // Erro de rede - tentar novamente
      const delay = Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

---

*— Morgan, planejando o futuro 📊*
