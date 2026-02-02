// Supabase Edge Function: ai-book-info
// Calls OpenAI to generate/enhance book information

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  action: 'generate_info' | 'enhance' | 'suggest';
  title?: string;
  author?: string;
  authors?: string[];
  existingDescription?: string;
  existingCategories?: string[];
  topic?: string;
  count?: number;
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<any> {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateBookInfo(title: string, author?: string) {
  const systemPrompt = `Você é um especialista em livros e literatura. Forneça informações detalhadas sobre livros em formato JSON.
Sempre responda em português brasileiro.
Se não conhecer o livro específico, faça uma estimativa educada baseada no título e autor.`;

  const userPrompt = `Forneça informações sobre o livro "${title}"${author ? ` de ${author}` : ''}.

Retorne um JSON com:
{
  "title": "título completo do livro",
  "authors": ["autor1", "autor2"],
  "description": "descrição detalhada do livro em 2-3 parágrafos",
  "categories": ["categoria1", "categoria2", "categoria3"],
  "publishedDate": "ano de publicação ou null",
  "pageCount": número aproximado de páginas ou null,
  "language": "pt" ou "en",
  "keyInsights": ["insight1", "insight2", "insight3"]
}`;

  return await callOpenAI(systemPrompt, userPrompt);
}

async function enhanceBookData(
  title: string,
  authors: string[],
  existingDescription?: string,
  existingCategories?: string[]
) {
  const systemPrompt = `Você é um especialista em livros. Sua tarefa é melhorar/completar informações de livros.
Sempre responda em português brasileiro.`;

  const needsDescription = !existingDescription || existingDescription.length < 100;
  const needsCategories = !existingCategories || existingCategories.length === 0;

  const userPrompt = `Livro: "${title}" por ${authors.join(', ')}

${needsDescription ? 'Preciso de uma descrição detalhada (2-3 parágrafos).' : ''}
${needsCategories ? 'Preciso de 3-5 categorias relevantes.' : ''}

Retorne um JSON com:
{
  "description": "${needsDescription ? 'descrição detalhada aqui' : existingDescription}",
  "categories": ${needsCategories ? '["categoria1", "categoria2", "categoria3"]' : JSON.stringify(existingCategories)}
}`;

  return await callOpenAI(systemPrompt, userPrompt);
}

async function suggestBooks(topic: string, count: number = 5) {
  const systemPrompt = `Você é um curador de livros especialista. Sugira livros relevantes e de alta qualidade.
Sempre responda em português brasileiro.
Priorize livros clássicos e bem avaliados, mas inclua também obras contemporâneas relevantes.`;

  const userPrompt = `Sugira ${count} livros sobre o tema: "${topic}"

Retorne um JSON com:
{
  "suggestions": [
    {
      "title": "título do livro",
      "author": "nome do autor",
      "reason": "por que esse livro é relevante (1-2 frases)"
    }
  ]
}`;

  return await callOpenAI(systemPrompt, userPrompt);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const body: RequestBody = await req.json();
    let result;

    switch (body.action) {
      case 'generate_info':
        if (!body.title) throw new Error('title is required');
        result = await generateBookInfo(body.title, body.author);
        break;

      case 'enhance':
        if (!body.title) throw new Error('title is required');
        result = await enhanceBookData(
          body.title,
          body.authors || [],
          body.existingDescription,
          body.existingCategories
        );
        break;

      case 'suggest':
        if (!body.topic) throw new Error('topic is required');
        result = await suggestBooks(body.topic, body.count || 5);
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
