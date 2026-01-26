
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRole } from '../types';
import { contentsApi, questionsApi, uploadApi, aiApi, chatSessionsApi, userStatsApi, ttsApi } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChapterReaderProps {
    userRole?: UserRole;
}

const ChapterReader: React.FC<ChapterReaderProps> = ({ userRole = 'STUDENT' }) => {
  const navigate = useNavigate();
  const { courseId, chapterId, contentId } = useParams<{ courseId: string; chapterId: string; contentId: string }>();
  // Estado para armazenar qual pergunta socrática está selecionada
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  // Estado para controlar se o chat está em tela cheia
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Estado para dados do conteúdo carregado
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Tipo de conteúdo (pode vir dos dados ou ser alterado pelo usuário se disponível)
  const [contentType, setContentType] = useState<'TEXT' | 'VIDEO' | 'AUDIO'>('TEXT');
  const [viewMode, setViewMode] = useState<'file' | 'text'>('file'); // Modo de visualização: arquivo original ou texto extraído
  const [interactionCount, setInteractionCount] = useState(0);
  const MAX_INTERACTIONS = 3;

  // Estado de Edição (Instrutor)
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Estado do Chat Socrático
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lockedQuestionId, setLockedQuestionId] = useState<string | null>(null); // Pergunta bloqueada após primeira resposta
  const [isCheckingAI, setIsCheckingAI] = useState(false); // Estado de verificação de IA
  const [chatSessionId, setChatSessionId] = useState<string | null>(null); // ID da sessão persistida
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ref para o input do chat para focar automaticamente
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Refs para upload de mídia
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Ref para o conteúdo editável
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Estado para o navegador de seções (TOC)
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [showToc, setShowToc] = useState(true);
  const [activeTocItem, setActiveTocItem] = useState<string | null>(null);

  // Estado para tracking de tempo de estudo
  const startTimeRef = useRef<number>(Date.now());
  const lastSaveTimeRef = useRef<number>(Date.now());
  const [isContentCompleted, setIsContentCompleted] = useState(false);

  // Estado para TTS (Text-to-Speech)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [ttsStyle, setTtsStyle] = useState<'resumo' | 'explicacao' | 'podcast'>('podcast');

  // Estado para transcrição (Speech-to-Text)
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  // Função para salvar tempo de estudo
  const saveStudyTime = useCallback(async (markAsCompleted: boolean = false) => {
    const storedUser = localStorage.getItem('user-data');
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId || !contentId || !courseId) return;

    const now = Date.now();
    const timeSpentMinutes = Math.round((now - startTimeRef.current) / 60000);

    // Só salva se passou pelo menos 1 minuto desde o último save
    if (timeSpentMinutes < 1 && !markAsCompleted) return;

    try {
      await userStatsApi.completeContent(userId, courseId, contentId, timeSpentMinutes);
      lastSaveTimeRef.current = now;

      if (markAsCompleted) {
        setIsContentCompleted(true);
      }
    } catch (error) {
      console.error('Erro ao salvar tempo de estudo:', error);
    }
  }, [contentId, courseId]);

  // Salvar tempo quando o usuário sai da página
  useEffect(() => {
    // Reset start time when content changes
    startTimeRef.current = Date.now();
    lastSaveTimeRef.current = Date.now();

    // Save time periodically (every 5 minutes)
    const intervalId = setInterval(() => {
      saveStudyTime(false);
    }, 5 * 60 * 1000);

    // Save time when user leaves the page
    const handleBeforeUnload = () => {
      saveStudyTime(false);
    };

    // Save time when visibility changes (user switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveStudyTime(false);
      } else {
        // Reset start time when user comes back
        startTimeRef.current = Date.now();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Save time when component unmounts
      saveStudyTime(false);
    };
  }, [contentId, saveStudyTime]);

  // Função para extrair cabeçalhos do texto e gerar IDs
  const extractHeadings = (text: string): Array<{ id: string; text: string; level: number }> => {
    if (!text) return [];

    const headings: Array<{ id: string; text: string; level: number }> = [];
    const lines = text.split('\n');
    let headingIndex = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Detecta títulos em ALL CAPS
      const isAllCaps = trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3 && /[A-Z]/.test(trimmedLine);
      const isShortTitle = trimmedLine.length < 60 && !trimmedLine.endsWith('.') && !trimmedLine.endsWith(',');

      // Títulos numerados
      const isNumberedTitle = /^(\d+\.?\d*\.?\s+|Capítulo\s+\d+|CAPÍTULO\s+\d+|Seção\s+\d+|SEÇÃO\s+\d+)/i.test(trimmedLine);

      if ((isAllCaps && isShortTitle) || isNumberedTitle) {
        const id = `heading-${headingIndex++}`;
        const dots = (trimmedLine.match(/\./g) || []).length;
        const level = isAllCaps ? 1 : dots <= 1 ? 2 : 3;

        headings.push({
          id,
          text: isAllCaps ? trimmedLine.charAt(0) + trimmedLine.slice(1).toLowerCase() : trimmedLine,
          level
        });
      }
    }

    return headings;
  };

  // Função para rolar até uma seção
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTocItem(id);
    }
  };

  // Função para formatar texto extraído de forma bonita
  const formatExtractedText = (rawText: string): string => {
    if (!rawText) return '';

    // Se já contém HTML bem formatado, retorna como está
    if (rawText.includes('<h1>') || rawText.includes('<h2>') || rawText.includes('<div class="formatted')) {
      return rawText;
    }

    // Limpa o texto de caracteres problemáticos
    let cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, '  ')
      .replace(/\u00A0/g, ' '); // Non-breaking spaces

    // Divide o texto em linhas
    const lines = cleanText.split('\n');
    let formattedHtml = '';
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';
    let currentParagraph = '';
    let headingIndex = 0;

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        // Processa formatação inline (negrito, itálico)
        let processed = currentParagraph.trim()
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/__(.+?)__/g, '<strong>$1</strong>')
          .replace(/_(.+?)_/g, '<em>$1</em>');
        formattedHtml += `<p class="mb-4 text-gray-700 leading-relaxed text-base">${processed}</p>`;
        currentParagraph = '';
      }
    };

    const closeList = () => {
      if (inList) {
        formattedHtml += listType === 'ol' ? '</ol>' : '</ul>';
        inList = false;
      }
    };

    // Função para detectar se é um título
    const detectTitle = (line: string, nextLine: string): { isTitle: boolean; level: number } => {
      const trimmed = line.trim();

      // Títulos em Markdown
      if (/^#{1,6}\s+/.test(trimmed)) {
        const level = (trimmed.match(/^#+/) || [''])[0].length;
        return { isTitle: true, level: Math.min(level, 4) };
      }

      // ALL CAPS curto (provável título)
      const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /[A-Z]/.test(trimmed);
      const isShort = trimmed.length < 80 && !trimmed.endsWith('.') && !trimmed.endsWith(',');
      if (isAllCaps && isShort && trimmed.length > 3) {
        return { isTitle: true, level: 2 };
      }

      // Títulos numerados: "1.", "1.1", "Capítulo 1", "Módulo 1", etc.
      if (/^(\d+\.?\s+[A-Z]|Capítulo\s+\d+|CAPÍTULO\s+\d+|Módulo\s+\d+|MÓDULO\s+\d+|Seção\s+\d+|SEÇÃO\s+\d+|Parte\s+\d+|PARTE\s+\d+)/i.test(trimmed)) {
        const dots = (trimmed.match(/\./g) || []).length;
        return { isTitle: true, level: dots <= 1 ? 3 : 4 };
      }

      // Linha curta seguida de linha vazia ou texto longo (provável título)
      if (isShort && trimmed.length < 60 && trimmed.length > 3) {
        if (!nextLine || nextLine.length > trimmed.length * 2) {
          // Verificar se parece um título (começa com maiúscula, sem pontuação final comum)
          if (/^[A-Z]/.test(trimmed) && !/[.!?;,]$/.test(trimmed)) {
            return { isTitle: true, level: 3 };
          }
        }
      }

      return { isTitle: false, level: 0 };
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const nextLine = lines[i + 1]?.trim() || '';

      // Linha vazia - fecha parágrafo atual
      if (!trimmedLine) {
        closeList();
        flushParagraph();
        continue;
      }

      // Remove marcadores Markdown de título
      const cleanTitle = trimmedLine.replace(/^#+\s+/, '');

      // Detecta título
      const titleInfo = detectTitle(trimmedLine, nextLine);
      if (titleInfo.isTitle) {
        closeList();
        flushParagraph();
        const headingId = `heading-${headingIndex++}`;

        // Formata o texto do título (capitaliza se for ALL CAPS)
        let titleText = cleanTitle;
        if (cleanTitle === cleanTitle.toUpperCase() && cleanTitle.length > 3) {
          titleText = cleanTitle.charAt(0) + cleanTitle.slice(1).toLowerCase();
        }

        switch (titleInfo.level) {
          case 1:
            formattedHtml += `<h1 id="${headingId}" class="toc-heading text-3xl font-display font-bold text-harven-dark mt-12 mb-6 pb-3 border-b-2 border-primary scroll-mt-24">${titleText}</h1>`;
            break;
          case 2:
            formattedHtml += `<h2 id="${headingId}" class="toc-heading text-2xl font-display font-bold text-harven-dark mt-10 mb-4 pb-2 border-b border-harven-border scroll-mt-24">${titleText}</h2>`;
            break;
          case 3:
            formattedHtml += `<h3 id="${headingId}" class="toc-heading text-xl font-bold text-harven-dark mt-8 mb-3 scroll-mt-24">${titleText}</h3>`;
            break;
          default:
            formattedHtml += `<h4 id="${headingId}" class="toc-heading text-lg font-semibold text-harven-dark mt-6 mb-2 pl-4 border-l-2 border-primary scroll-mt-24">${titleText}</h4>`;
        }
        continue;
      }

      // Detecta itens de lista não ordenada (-, *, •)
      const unorderedListMatch = trimmedLine.match(/^[-*•]\s+(.+)/);
      if (unorderedListMatch) {
        flushParagraph();
        if (!inList || listType !== 'ul') {
          closeList();
          formattedHtml += '<ul class="list-none space-y-2 my-4 pl-2">';
          inList = true;
          listType = 'ul';
        }
        formattedHtml += `<li class="flex items-start gap-3"><span class="text-primary mt-1 flex-shrink-0">●</span><span class="text-gray-700">${unorderedListMatch[1]}</span></li>`;
        continue;
      }

      // Detecta itens de lista ordenada (1., 1), a., a))
      const orderedListMatch = trimmedLine.match(/^(\d+|[a-zA-Z])[.)]\s+(.+)/);
      if (orderedListMatch) {
        flushParagraph();
        if (!inList || listType !== 'ol') {
          closeList();
          formattedHtml += '<ol class="list-none space-y-2 my-4 pl-2 counter-reset-item">';
          inList = true;
          listType = 'ol';
        }
        formattedHtml += `<li class="flex items-start gap-3"><span class="text-primary font-bold mt-0 flex-shrink-0 min-w-[20px]">${orderedListMatch[1]}.</span><span class="text-gray-700">${orderedListMatch[2]}</span></li>`;
        continue;
      }

      // Detecta citações (começa com > ou " ou »)
      if (/^[>"]/.test(trimmedLine) || /^»/.test(trimmedLine)) {
        closeList();
        flushParagraph();
        const quoteText = trimmedLine.replace(/^[>"»]\s*/, '').replace(/[""]$/, '');
        formattedHtml += `<blockquote class="border-l-4 border-harven-gold bg-harven-gold/5 pl-4 py-3 my-6 italic text-gray-600 rounded-r-lg">${quoteText}</blockquote>`;
        continue;
      }

      // Detecta separadores (---, ***, ___)
      if (/^[-*_]{3,}$/.test(trimmedLine)) {
        closeList();
        flushParagraph();
        formattedHtml += '<hr class="my-8 border-t border-harven-border" />';
        continue;
      }

      // Texto normal - acumula no parágrafo
      closeList();
      if (currentParagraph) {
        currentParagraph += ' ' + trimmedLine;
      } else {
        currentParagraph = trimmedLine;
      }

      // Se a linha termina com pontuação forte e próxima linha parece um novo parágrafo
      if (/[.!?]$/.test(trimmedLine) && nextLine && /^[A-Z]/.test(nextLine)) {
        flushParagraph();
      }
    }

    // Fecha qualquer coisa pendente
    closeList();
    flushParagraph();

    // Se não gerou nada significativo, formata de forma simples
    if (!formattedHtml.trim() || formattedHtml.length < 50) {
      const paragraphs = rawText.split(/\n\n+/).filter(p => p.trim());
      return `<div class="space-y-4">${paragraphs.map(p =>
        `<p class="text-gray-700 leading-relaxed text-base">${p.trim().replace(/\n/g, ' ')}</p>`
      ).join('')}</div>`;
    }

    return `<div class="formatted-content space-y-1">${formattedHtml}</div>`;
  };

  // Função para detectar tipo real do conteúdo pela URL
  const detectContentTypeFromUrl = (url: string): 'TEXT' | 'VIDEO' | 'AUDIO' => {
    if (!url) return 'TEXT';
    const urlLower = url.toLowerCase();
    if (urlLower.match(/\.(mp4|mov|avi|webm|mkv)(\?|$)/i)) return 'VIDEO';
    if (urlLower.match(/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i)) return 'AUDIO';
    return 'TEXT';
  };

  // Carregar dados do conteúdo
  useEffect(() => {
    const loadContent = async () => {
      if (!contentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Carregar conteúdo real da API
        const contentResult = await contentsApi.get(contentId);
        setContent(contentResult);

        // Carregar perguntas associadas a este conteúdo
        const questionsData = contentResult.questions || await questionsApi.list(contentId);
        setQuestions(questionsData || []);

        // Definir tipo de conteúdo baseado nos dados reais OU pela URL
        let detectedType: 'TEXT' | 'VIDEO' | 'AUDIO' = 'TEXT';
        if (contentResult.type) {
          detectedType = contentResult.type.toUpperCase() as any;
        }
        // Se o tipo é TEXT mas a URL indica áudio/vídeo, usar o tipo da URL
        if (detectedType === 'TEXT' && contentResult.content_url) {
          const urlType = detectContentTypeFromUrl(contentResult.content_url);
          if (urlType !== 'TEXT') {
            detectedType = urlType;
          }
        }
        setContentType(detectedType);

        // Setar conteúdo editável
        setEditedContent(contentResult.text_content || '');

      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        // Fallback para dados básicos se a API falhar
        setContent({
          id: contentId,
          title: 'Conteúdo',
          type: 'TEXT',
          text_content: null,
          content_url: null
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId]);

  // Extrair cabeçalhos do texto para o TOC quando o conteúdo é carregado
  useEffect(() => {
    if (content?.text_content && viewMode === 'text') {
      const headings = extractHeadings(content.text_content);
      setTocItems(headings);
    } else {
      setTocItems([]);
    }
  }, [content?.text_content, viewMode]);

  // Observar scroll para destacar item ativo no TOC
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveTocItem(tocItems[i].id);
          return;
        }
      }
      if (tocItems.length > 0) {
        setActiveTocItem(tocItems[0].id);
      }
    };

    const scrollContainer = document.querySelector('.scrollbar-hide');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [tocItems]);

  // Descrições genéricas para as perguntas socráticas (não mostrar expected_answer)
  const questionDescriptions = [
    'Reflita sobre este conceito e demonstre sua compreensão',
    'Analise criticamente e apresente sua perspectiva',
    'Explore diferentes ângulos desta questão',
    'Conecte este tema com situações práticas',
    'Questione suas próprias suposições sobre o tema'
  ];

  // Perguntas socráticas - carregadas da API ou fallback
  const socraticQuestions = questions.length > 0
    ? questions.map((q: any, i: number) => ({
        id: q.id || `q${i}`,
        question: q.question_text || q.question || q.text,
        description: questionDescriptions[i % questionDescriptions.length],
        difficulty: q.difficulty || 'medium',
        icon: ['analytics', 'warning', 'groups', 'psychology', 'lightbulb'][i % 5]
      }))
    : [
        {
          id: 'q1',
          question: "Explique o conceito principal",
          description: "Demonstre sua compreensão do tema",
          icon: "analytics"
        },
        {
          id: 'q2',
          question: "Quais são as aplicações práticas?",
          description: "Como isso se aplica no mundo real?",
          icon: "lightbulb"
        },
        {
          id: 'q3',
          question: "Quais são os desafios comuns?",
          description: "Identifique possíveis dificuldades",
          icon: "warning"
        }
      ];

  const handleQuestionSelect = (questionId: string, questionText: string) => {
    // Se estiver editando, não abre o chat
    if (isEditing) return;

    // Se há uma pergunta bloqueada e esta não é a pergunta bloqueada, não permitir
    if (lockedQuestionId && lockedQuestionId !== questionId) {
      return; // Não faz nada - pergunta está bloqueada
    }

    setSelectedQuestion(questionText);
    setIsFullScreen(false);
  };

  const closeChat = () => {
    setSelectedQuestion(null);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Reiniciar conversa socrática - libera todas as perguntas
  const resetConversation = () => {
    setSelectedQuestion(null);
    setLockedQuestionId(null);
    setChatMessages([]);
    setInteractionCount(0);
    setChatError(null);
    setIsFullScreen(false);
    setChatSessionId(null); // Limpar sessão atual - uma nova será criada na próxima pergunta
  };

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Iniciar chat quando uma pergunta é selecionada (com persistência)
  const initializeChat = async (question: string) => {
    setChatMessages([]);
    setInteractionCount(0);
    setChatError(null);
    setIsAiThinking(false);
    setChatSessionId(null);

    // Obter userId do localStorage
    const storedUser = localStorage.getItem('user-data');
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId || !contentId) {
      // Fallback para modo local se não houver usuário ou conteúdo
      const initialMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: `Vamos explorar juntos a questão:\n\n"${question}"\n\nAntes de compartilhar minha perspectiva, gostaria de ouvir a sua. O que você pensa sobre isso? Qual é seu entendimento inicial?`,
        timestamp: new Date()
      };
      setChatMessages([initialMessage]);
      return;
    }

    try {
      // Criar ou obter sessão existente
      const session = await chatSessionsApi.createOrGet({
        user_id: userId,
        content_id: contentId,
        chapter_id: chapterId || undefined,
        course_id: courseId || undefined
      });

      setChatSessionId(session.id);

      // Carregar mensagens existentes da sessão
      const existingMessages = await chatSessionsApi.getMessages(session.id);

      if (existingMessages && existingMessages.length > 0) {
        // Restaurar mensagens existentes
        const restoredMessages: ChatMessage[] = existingMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role === 'assistant' ? 'ai' : msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }));
        setChatMessages(restoredMessages);

        // Calcular interações do usuário
        const userMsgs = existingMessages.filter((m: any) => m.role === 'user');
        setInteractionCount(userMsgs.length);

        // Se já tem mensagens, bloquear a pergunta
        if (userMsgs.length > 0) {
          const currentQ = socraticQuestions.find(q => q.question === question);
          if (currentQ) {
            setLockedQuestionId(currentQ.id);
          }
        }
      } else {
        // Nova sessão - criar mensagem inicial
        const initialContent = `Vamos explorar juntos a questão:\n\n"${question}"\n\nAntes de compartilhar minha perspectiva, gostaria de ouvir a sua. O que você pensa sobre isso? Qual é seu entendimento inicial?`;

        // Salvar mensagem inicial no banco
        await chatSessionsApi.addMessage(session.id, {
          role: 'assistant',
          content: initialContent,
          agent_type: 'socrates',
          metadata: { type: 'initial_question', question }
        });

        const initialMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'ai',
          content: initialContent,
          timestamp: new Date()
        };
        setChatMessages([initialMessage]);
      }
    } catch (error) {
      console.error('Erro ao inicializar sessão de chat:', error);
      // Fallback para modo local
      const initialMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: `Vamos explorar juntos a questão:\n\n"${question}"\n\nAntes de compartilhar minha perspectiva, gostaria de ouvir a sua. O que você pensa sobre isso? Qual é seu entendimento inicial?`,
        timestamp: new Date()
      };
      setChatMessages([initialMessage]);
    }
  };

  const handleSend = async () => {
    if (interactionCount >= MAX_INTERACTIONS) return;
    if (!chatInputRef.current || chatInputRef.current.value.trim() === '') return;

    const userMessage = chatInputRef.current.value.trim();
    chatInputRef.current.value = '';

    // Bloquear a pergunta atual após primeira resposta
    if (!lockedQuestionId && selectedQuestion) {
      const currentQ = socraticQuestions.find(q => q.question === selectedQuestion);
      if (currentQ) {
        setLockedQuestionId(currentQ.id);
      }
    }

    // Adicionar mensagem do usuário
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    const newInteractionCount = interactionCount + 1;
    setInteractionCount(newInteractionCount);
    setIsAiThinking(true);
    setIsCheckingAI(true);
    setChatError(null);

    // Persistir mensagem do usuário no banco
    if (chatSessionId) {
      try {
        await chatSessionsApi.addMessage(chatSessionId, {
          role: 'user',
          content: userMessage,
          metadata: { interaction_number: newInteractionCount }
        });
      } catch (e) {
        console.warn('Erro ao persistir mensagem do usuário:', e);
      }
    }

    try {
      // 1. Verificar se a resposta foi gerada por IA
      let isAIGenerated = false;
      let aiProbability = 0;
      let aiVerdict = '';
      try {
        const aiCheck = await aiApi.detectAI({ text: userMessage });
        // A API retorna { ai_detection: { probability, verdict, confidence } }
        const detection = aiCheck?.ai_detection;
        aiProbability = detection?.probability || 0;
        aiVerdict = detection?.verdict || '';
        isAIGenerated = aiVerdict === 'likely_ai' || aiProbability > 0.7;
      } catch (e) {
        // AI detection não disponível - continua sem verificação
      }
      setIsCheckingAI(false);

      // Se foi detectado como IA, mostrar aviso
      if (isAIGenerated) {
        const probabilityPercent = Math.round(aiProbability * 100);
        const warningContent = `⚠️ **Opa!** Parece que essa resposta foi gerada por uma IA (${probabilityPercent}% de probabilidade).\n\nO objetivo do método socrático é desenvolver seu próprio raciocínio crítico. Tente responder com suas próprias palavras - não precisa ser perfeito, o importante é o processo de reflexão!\n\nVamos tentar de novo?`;

        const warningMsg: ChatMessage = {
          id: `ai_warning_${Date.now()}`,
          role: 'ai',
          content: warningContent,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, warningMsg]);
        setInteractionCount(prev => prev - 1); // Não conta como interação válida

        // Persistir aviso de IA no banco
        if (chatSessionId) {
          try {
            await chatSessionsApi.addMessage(chatSessionId, {
              role: 'assistant',
              content: warningContent,
              agent_type: 'analyst',
              metadata: { type: 'ai_detection_warning', probability: aiProbability }
            });
          } catch (e) {
            console.warn('Erro ao persistir aviso de IA:', e);
          }
        }

        setIsAiThinking(false);
        return;
      }

      // 2. Buscar dados da pergunta original
      const questionData = questions.find((q: any) =>
        (q.question_text || q.question || q.text) === selectedQuestion
      );

      // Preparar histórico de conversa
      const relevantMessages = chatMessages.slice(1);
      const conversationHistory = [...relevantMessages, userMsg]
        .filter(m => m.role === 'user')
        .map(m => ({
          role: 'user',
          content: m.content,
          timestamp: m.timestamp.toISOString()
        }));

      const response = await aiApi.socraticDialogue({
        student_message: userMessage,
        chapter_content: content?.text_content || content?.title || '',
        initial_question: {
          text: selectedQuestion || '',
          skill: questionData?.skill || 'análise crítica',
          intention: questionData?.expected_answer || 'explorar o conceito em profundidade'
        },
        conversation_history: conversationHistory,
        interactions_remaining: MAX_INTERACTIONS - newInteractionCount
      });

      // Adicionar resposta da IA
      const aiContent = response?.response?.content || response?.follow_up || response?.message || 'Interessante perspectiva. Pode elaborar mais sobre isso?';
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: aiContent,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMsg]);

      // Persistir resposta da IA no banco
      if (chatSessionId) {
        try {
          await chatSessionsApi.addMessage(chatSessionId, {
            role: 'assistant',
            content: aiContent,
            agent_type: 'socrates',
            metadata: {
              interaction_number: newInteractionCount,
              is_final: newInteractionCount >= MAX_INTERACTIONS
            }
          });

          // Se for a última interação, marcar sessão como completada
          if (newInteractionCount >= MAX_INTERACTIONS) {
            await chatSessionsApi.complete(chatSessionId);
          }
        } catch (e) {
          console.warn('Erro ao persistir resposta da IA:', e);
        }
      }
    } catch (error: any) {
      console.error('Erro no chat:', error);
      setChatError('Erro ao processar resposta. Tente novamente.');
      // Fallback response
      const fallbackResponses = [
        'Interessante! Você poderia expandir um pouco mais esse raciocínio? O que te levou a essa conclusão?',
        'Boa reflexão. Mas e se considerássemos uma perspectiva diferente? Como isso mudaria sua análise?',
        'Você levantou um ponto válido. Consegue pensar em um exemplo prático que ilustre essa ideia?',
        'Entendo seu ponto de vista. Quais seriam as possíveis consequências dessa linha de pensamento?'
      ];
      const fallbackContent = fallbackResponses[Math.min(newInteractionCount - 1, fallbackResponses.length - 1)];
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: fallbackContent,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, fallbackMsg]);

      // Persistir mesmo a resposta fallback
      if (chatSessionId) {
        try {
          await chatSessionsApi.addMessage(chatSessionId, {
            role: 'assistant',
            content: fallbackContent,
            agent_type: 'socrates',
            metadata: { type: 'fallback', error: error.message }
          });
        } catch (e) {
          console.warn('Erro ao persistir fallback:', e);
        }
      }
    } finally {
      setIsAiThinking(false);
      setIsCheckingAI(false);
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  // Inicializar chat quando pergunta é selecionada
  useEffect(() => {
    if (selectedQuestion && !isEditing) {
      initializeChat(selectedQuestion);
    }
  }, [selectedQuestion]);

  // Foca no input quando o chat abre
  useEffect(() => {
    if (selectedQuestion && chatInputRef.current && interactionCount < MAX_INTERACTIONS && !isAiThinking) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 500);
    }
  }, [selectedQuestion, isFullScreen, interactionCount, isAiThinking]);

  // Chat is now inline, no need for height calculations

  // ========== FORMATAÇÃO DE TEXTO ==========
  const applyTextFormat = (command: string, value?: string) => {
    // Usar execCommand para formatação (funciona em contentEditable)
    document.execCommand(command, false, value);

    // Manter foco no elemento editável
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  };

  const handleBold = () => {
    applyTextFormat('bold');
  };

  const handleItalic = () => {
    applyTextFormat('italic');
  };

  const handleHighlight = () => {
    // Aplicar cor de fundo amarela para grifo
    applyTextFormat('hiliteColor', '#FFEB3B');
  };

  const handleAddLink = () => {
    const url = prompt('Digite a URL do link:');
    if (url) {
      applyTextFormat('createLink', url);
    }
  };

  const handleRewriteWithAI = async () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      alert('Selecione um texto para reescrever com IA');
      return;
    }

    // TODO: Integrar com API de IA para reescrita
    alert('Funcionalidade de reescrita com IA em desenvolvimento');
  };

  // ========== GERAR ÁUDIO COM TTS ==========
  const handleGenerateAudio = async () => {
    if (!contentId || !content?.text_content) {
      alert('É necessário ter conteúdo de texto para gerar áudio.');
      return;
    }

    setIsGeneratingAudio(true);
    setTtsError(null);

    try {
      const result = await ttsApi.generateSummary({
        content_id: contentId,
        style: ttsStyle
      });

      if (result.success && result.audio_url) {
        setGeneratedAudioUrl(result.audio_url);
        // Também atualizar o content local para persistir na interface
        setContent((prev: any) => ({ ...prev, audio_url: result.audio_url }));
      } else {
        throw new Error(result.error || 'Erro ao gerar áudio');
      }
    } catch (error: any) {
      console.error('Erro ao gerar áudio:', error);
      setTtsError(error.response?.data?.detail || error.message || 'Erro ao gerar áudio. Tente novamente.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // ========== TRANSCREVER ÁUDIO ==========
  const handleTranscribe = async () => {
    if (!contentId || !content?.content_url) {
      alert('É necessário ter um arquivo de áudio/vídeo para transcrever.');
      return;
    }

    setIsTranscribing(true);
    setTranscriptionError(null);

    try {
      const result = await ttsApi.transcribe({
        content_id: contentId,
        audio_url: content.content_url
      });

      if (result.success && result.text) {
        // Atualizar o conteúdo local com o texto transcrito
        setContent((prev: any) => ({ ...prev, text_content: result.text }));
        setEditedContent(result.text);
        alert('Transcrição concluída com sucesso!');
      } else {
        throw new Error(result.error || 'Erro ao transcrever');
      }
    } catch (error: any) {
      console.error('Erro ao transcrever:', error);
      setTranscriptionError(error.response?.data?.detail || error.message || 'Erro ao transcrever. Tente novamente.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAddImage = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) {
      applyTextFormat('insertImage', url);
    }
  };

  // ========== SALVAR CONTEÚDO ==========
  const handleSaveContent = async () => {
    if (!contentId || !contentEditableRef.current) return;

    setIsSaving(true);
    try {
      const newTextContent = contentEditableRef.current.innerHTML;

      await contentsApi.update(contentId, {
        text_content: newTextContent
      });

      setContent((prev: any) => ({ ...prev, text_content: newTextContent }));
      setIsEditing(false);
      alert('Conteúdo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar conteúdo');
    } finally {
      setIsSaving(false);
    }
  };

  // ========== UPLOAD DE MÍDIA ==========
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contentId) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione um arquivo de vídeo válido');
      return;
    }

    // Validar tamanho (máximo 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('O arquivo é muito grande. Máximo permitido: 500MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadApi.upload(file, 'video');

      // Atualizar conteúdo com a URL do vídeo
      await contentsApi.update(contentId, {
        content_url: result.url,
        type: 'video'
      });

      setContent((prev: any) => ({
        ...prev,
        content_url: result.url,
        type: 'video'
      }));

      alert('Vídeo enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar vídeo');
    } finally {
      setIsUploading(false);
      // Limpar input
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contentId) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('audio/')) {
      alert('Por favor, selecione um arquivo de áudio válido');
      return;
    }

    // Validar tamanho (máximo 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('O arquivo é muito grande. Máximo permitido: 100MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadApi.upload(file, 'audio');

      // Atualizar conteúdo com a URL do áudio
      await contentsApi.update(contentId, {
        content_url: result.url,
        type: 'audio'
      });

      setContent((prev: any) => ({
        ...prev,
        content_url: result.url,
        type: 'audio'
      }));

      alert('Áudio enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar áudio');
    } finally {
      setIsUploading(false);
      // Limpar input
      if (audioInputRef.current) audioInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white relative">

      {/* TOC - Table of Contents (Navegador de Seções) - Menu Flutuante à Direita */}
      {tocItems.length > 0 && viewMode === 'text' && (
        <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${showToc ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-harven-border p-4 w-[240px] max-h-[70vh] overflow-hidden flex flex-col">
            {/* Header do TOC */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-harven-border">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">toc</span>
                <span className="text-xs font-bold text-harven-dark uppercase tracking-wider">Índice</span>
              </div>
              <button
                onClick={() => setShowToc(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Fechar índice"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Lista de seções */}
            <nav className="overflow-y-auto custom-scrollbar flex-1 pr-1">
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all duration-200 line-clamp-2 ${
                        activeTocItem === item.id
                          ? 'bg-primary/10 text-primary-dark font-bold border-l-2 border-primary'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-harven-dark'
                      } ${
                        item.level === 1 ? 'font-semibold' :
                        item.level === 2 ? 'pl-4' :
                        'pl-6 text-[11px]'
                      }`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Progress indicator */}
            <div className="mt-3 pt-2 border-t border-harven-border">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>{tocItems.length} seções</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">keyboard_arrow_up</span>
                  <span className="material-symbols-outlined text-[12px]">keyboard_arrow_down</span>
                  navegar
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão para reabrir o TOC quando fechado */}
      {tocItems.length > 0 && viewMode === 'text' && !showToc && (
        <button
          onClick={() => setShowToc(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-white shadow-lg border border-harven-border p-3 rounded-xl hover:shadow-xl transition-all group"
          title="Mostrar índice"
        >
          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">toc</span>
        </button>
      )}

      {/* Content Area - Now includes inline chat */}
      <div className="w-full overflow-y-auto relative scrollbar-hide flex-1">

        {/* Instructor Editing Toolbar (Sticky) */}
        {isEditing && (
            <div className="sticky top-4 left-0 right-0 z-50 flex justify-center animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
                <div className="bg-harven-dark/90 backdrop-blur-md text-white p-2 rounded-xl shadow-2xl flex items-center gap-1 pointer-events-auto border border-white/10">
                    <button
                        onClick={handleBold}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Negrito (Ctrl+B)"
                    >
                        <span className="material-symbols-outlined text-[20px]">format_bold</span>
                    </button>
                    <button
                        onClick={handleItalic}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Itálico (Ctrl+I)"
                    >
                        <span className="material-symbols-outlined text-[20px]">format_italic</span>
                    </button>
                    <button
                        onClick={handleHighlight}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-400"
                        title="Grifar/Destacar"
                    >
                        <span className="material-symbols-outlined text-[20px]">border_color</span>
                    </button>
                    <button
                        onClick={handleAddLink}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Adicionar Link"
                    >
                        <span className="material-symbols-outlined text-[20px]">link</span>
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1"></div>
                    <button
                        onClick={handleRewriteWithAI}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary"
                        title="Reescrever com IA"
                    >
                        <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                    </button>
                    <button
                        onClick={handleAddImage}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Adicionar Imagem"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1"></div>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 bg-gray-600 text-white font-bold rounded-lg text-xs uppercase tracking-wide hover:bg-gray-500 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveContent}
                        disabled={isSaving}
                        className="px-4 py-1.5 bg-primary text-harven-dark font-bold rounded-lg text-xs uppercase tracking-wide hover:bg-primary-dark transition-colors ml-1 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="animate-spin material-symbols-outlined text-[16px]">progress_activity</span>
                                Salvando...
                            </>
                        ) : (
                            'Salvar'
                        )}
                    </button>
                </div>
            </div>
        )}

        <div className="max-w-3xl mx-auto p-12 flex flex-col gap-8">
          <header className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <button
                     onClick={() => navigate(`/course/${courseId}`)}
                     className="p-2 -ml-2 mr-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-harven-dark transition-colors"
                     title="Voltar ao curso"
                   >
                     <span className="material-symbols-outlined">arrow_back</span>
                   </button>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-harven-gold">
                     {content?.chapter?.title || 'Capítulo'} • {content?.type || 'AULA'}
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Botão de Edição para Instrutor */}
                    {userRole === 'INSTRUCTOR' && (
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${isEditing ? 'bg-primary text-harven-dark border-primary' : 'bg-white text-gray-500 border-harven-border hover:border-gray-400'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{isEditing ? 'check' : 'edit'}</span>
                            {isEditing ? 'Concluir' : 'Editar Conteúdo'}
                        </button>
                    )}

                    {/* Content Format Selector */}
                    <div className="flex items-center gap-2">
                        {/* Toggle Arquivo/Texto - só mostra se houver ambos */}
                        {content?.content_url && content?.text_content && contentType === 'TEXT' && (
                            <div className="bg-harven-bg p-1 rounded-lg flex items-center gap-1">
                                <button
                                    onClick={() => setViewMode('file')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'file' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Arquivo
                                </button>
                                <button
                                    onClick={() => setViewMode('text')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'text' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">notes</span> Modo Leitura
                                </button>
                            </div>
                        )}

                        {/* Tipo de mídia */}
                        <div className="bg-harven-bg p-1 rounded-lg flex items-center gap-1">
                            <button
                                onClick={() => setContentType('TEXT')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${contentType === 'TEXT' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                            >
                                <span className="material-symbols-outlined text-[16px]">article</span> Texto
                            </button>
                            <button
                                onClick={() => setContentType('VIDEO')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${contentType === 'VIDEO' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                            >
                                <span className="material-symbols-outlined text-[16px]">play_circle</span> Vídeo
                            </button>
                            <button
                                onClick={() => setContentType('AUDIO')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${contentType === 'AUDIO' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                            >
                                <span className="material-symbols-outlined text-[16px]">headphones</span> Áudio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <h1
                className={`text-4xl md:text-5xl font-display font-bold text-harven-dark leading-tight tracking-tight ${isEditing ? 'border-2 border-dashed border-gray-300 p-2 rounded-lg bg-gray-50' : ''}`}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
            >
              {content?.title || 'Conteúdo da Aula'}
            </h1>
            <div className="h-1 w-24 bg-primary rounded-full"></div>
          </header>

          {/* RENDERIZAÇÃO DO CONTEÚDO BASEADO NO TIPO */}

          {contentType === 'TEXT' && (
            <article className={`prose prose-lg max-w-none text-harven-dark/80 leading-relaxed font-sans text-lg space-y-8 animate-in fade-in duration-500 ${isEditing ? 'outline-2 outline-dashed outline-gray-200 p-4 rounded-xl' : ''}`}>
                {/* Modo Arquivo: Se houver URL de arquivo e viewMode é 'file' */}
                {viewMode === 'file' && content?.content_url && (
                    <div className="w-full bg-gray-100 rounded-2xl overflow-hidden border border-harven-border">
                        <div className="bg-harven-dark p-3 flex items-center justify-between">
                            <span className="text-white text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                                {content.title || 'Documento'}
                            </span>
                            <a
                                href={content.content_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-primary text-harven-dark px-3 py-1 rounded font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                Abrir em nova aba
                            </a>
                        </div>
                        {/* Tenta exibir no iframe - funciona para PDFs e muitos outros formatos */}
                        <iframe
                            src={content.content_url}
                            className="w-full h-[700px] bg-white"
                            title="Document Viewer"
                            onError={(e) => console.log('Iframe load error:', e)}
                        />
                    </div>
                )}

                {/* Modo Texto: Se viewMode é 'text', ou se é 'file' mas não tem URL de arquivo */}
                {(viewMode === 'text' || (viewMode === 'file' && !content?.content_url)) && content?.text_content && (
                    <div className="bg-white rounded-2xl border border-harven-border shadow-sm overflow-hidden">
                        {/* Header do modo texto */}
                        <div className="bg-gradient-to-r from-harven-bg to-white px-6 py-4 border-b border-harven-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-harven-dark/5 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-harven-dark">article</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-harven-dark text-sm">Conteúdo do Material</h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Versão em texto para leitura</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {tocItems.length > 0 && (
                                    <button
                                        onClick={() => setShowToc(!showToc)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                            showToc
                                                ? 'bg-primary/10 text-primary-dark border-primary/30'
                                                : 'bg-white text-gray-500 border-harven-border hover:border-gray-400'
                                        }`}
                                        title={showToc ? 'Ocultar índice' : 'Mostrar índice'}
                                    >
                                        <span className="material-symbols-outlined text-[14px]">toc</span>
                                        {tocItems.length} seções
                                    </button>
                                )}
                                {isEditing && (
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase">Modo Edição</span>
                                )}
                            </div>
                        </div>

                        {/* Conteúdo formatado */}
                        <div
                            ref={contentEditableRef}
                            contentEditable={isEditing}
                            suppressContentEditableWarning={true}
                            className={`p-8 outline-none ${isEditing ? 'focus:ring-2 focus:ring-primary/30 bg-yellow-50/30 min-h-[400px]' : ''}`}
                            dangerouslySetInnerHTML={{ __html: isEditing ? content.text_content : formatExtractedText(content.text_content) }}
                        />
                    </div>
                )}

                {/* Se só tem arquivo mas viewMode é text e não tem text_content */}
                {viewMode === 'text' && content?.content_url && !content?.text_content && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-harven-border">
                        <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">
                            {content.content_url.match(/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i) ? 'headphones' :
                             content.content_url.match(/\.(mp4|mov|avi|webm|mkv)(\?|$)/i) ? 'movie' : 'notes'}
                        </span>
                        <p className="text-lg font-bold text-gray-600">
                            {content.content_url.match(/\.(mp3|wav|ogg|m4a|aac|mp4|mov|avi|webm|mkv)(\?|$)/i)
                                ? 'Este conteúdo é um arquivo de mídia'
                                : 'Texto não extraído'}
                        </p>
                        <p className="text-sm mt-2 text-gray-400 mb-6">
                            {content.content_url.match(/\.(mp3|wav|ogg|m4a|aac|mp4|mov|avi|webm|mkv)(\?|$)/i)
                                ? 'Você pode transcrever o áudio para texto usando IA'
                                : 'Use a visualização de arquivo para ver o conteúdo original.'}
                        </p>

                        {/* Botão de transcrição para áudio/vídeo */}
                        {content.content_url.match(/\.(mp3|wav|ogg|m4a|aac|mp4|mov|avi|webm|mkv)(\?|$)/i) && userRole === 'INSTRUCTOR' && (
                            <div className="flex flex-col items-center gap-3">
                                {isTranscribing ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-600">Transcrevendo áudio...</p>
                                        <p className="text-xs text-gray-400">Isso pode levar alguns minutos</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleTranscribe}
                                        className="bg-primary text-harven-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors"
                                    >
                                        <span className="material-symbols-outlined">subtitles</span>
                                        Transcrever para Texto
                                    </button>
                                )}
                                {transcriptionError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm max-w-md">
                                        {transcriptionError}
                                    </div>
                                )}
                                <p className="text-[10px] text-gray-400 mt-2">Usa OpenAI Whisper para transcrever</p>
                            </div>
                        )}

                        {/* Botões para trocar de aba */}
                        <div className="flex justify-center gap-3 mt-6">
                            {content.content_url.match(/\.(mp4|mov|avi|webm|mkv)(\?|$)/i) && (
                                <button
                                    onClick={() => setContentType('VIDEO')}
                                    className="px-4 py-2 border border-harven-border rounded-lg text-sm font-bold text-gray-600 hover:border-primary hover:text-primary-dark transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                    Ver Vídeo
                                </button>
                            )}
                            {content.content_url.match(/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i) && (
                                <button
                                    onClick={() => setContentType('AUDIO')}
                                    className="px-4 py-2 border border-harven-border rounded-lg text-sm font-bold text-gray-600 hover:border-primary hover:text-primary-dark transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">headphones</span>
                                    Ouvir Áudio
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Se não houver conteúdo de texto, mostrar área editável vazia */}
                {!content?.text_content && !content?.content_url && isEditing && (
                    <div
                        ref={contentEditableRef}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        className="outline-none whitespace-pre-wrap focus:ring-2 focus:ring-primary/30 rounded-lg p-2 min-h-[200px] bg-gray-50 text-gray-400"
                        data-placeholder="Digite seu conteúdo aqui..."
                    />
                )}

                {/* Se não houver conteúdo, mostrar placeholder (apenas quando não está editando) */}
                {!content?.content_url && !content?.text_content && !isEditing && (
                    <div className="text-center py-12 text-gray-400">
                        <span className="material-symbols-outlined text-6xl mb-4">article</span>
                        <p className="text-lg font-bold">Nenhum conteúdo de texto disponível</p>
                        <p className="text-sm mt-2">Adicione conteúdo usando o editor acima.</p>
                    </div>
                )}
            </article>
          )}

          {contentType === 'VIDEO' && (
             <div className="w-full animate-in fade-in duration-500">
                {/* Input oculto para upload de vídeo */}
                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                />

                {/* Se houver URL de vídeo real */}
                {content?.content_url && (content.type === 'video' || content.content_url.match(/\.(mp4|webm|ogg|mov)$/i)) ? (
                    <div className="w-full bg-black rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-harven-dark p-3 flex items-center justify-between">
                            <span className="text-white text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">play_circle</span>
                                {content?.title || 'Vídeo'}
                            </span>
                            <div className="flex items-center gap-2">
                                {isEditing && (
                                    <button
                                        onClick={() => videoInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="text-xs bg-white/10 text-white px-3 py-1 rounded font-bold hover:bg-white/20 transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                                        Trocar Vídeo
                                    </button>
                                )}
                                <a
                                    href={content.content_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-primary text-harven-dark px-3 py-1 rounded font-bold hover:bg-primary-dark transition-colors"
                                >
                                    Abrir em nova aba
                                </a>
                            </div>
                        </div>
                        <video
                            src={content.content_url}
                            controls
                            className="w-full aspect-video"
                            poster={content.thumbnail_url}
                        >
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                ) : (
                    /* Placeholder quando não há vídeo */
                    <div className="w-full aspect-video bg-black rounded-2xl shadow-2xl relative overflow-hidden group">
                        {isEditing || userRole === 'INSTRUCTOR' ? (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 gap-4">
                                {isUploading ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
                                        <p className="text-white font-bold">Enviando vídeo...</p>
                                        <p className="text-gray-400 text-sm">Isso pode demorar alguns minutos</p>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => videoInputRef.current?.click()}
                                            className="bg-white text-harven-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined">upload</span>
                                            Adicionar Vídeo
                                        </button>
                                        <p className="text-gray-400 text-sm">Formatos suportados: MP4, WebM, OGG (máx. 500MB)</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-6xl mb-4">videocam_off</span>
                                <p className="text-lg font-bold">Nenhum vídeo disponível</p>
                                <p className="text-sm mt-2">O instrutor ainda não adicionou um vídeo.</p>
                            </div>
                        )}
                    </div>
                )}
             </div>
          )}

          {contentType === 'AUDIO' && (
              <div className={`bg-harven-dark rounded-2xl p-8 shadow-xl flex flex-col gap-6 animate-in fade-in duration-500 relative ${isEditing ? 'border-2 border-primary border-dashed' : ''}`}>
                 {/* Input oculto para upload de áudio */}
                 <input
                     ref={audioInputRef}
                     type="file"
                     accept="audio/*"
                     onChange={handleAudioUpload}
                     className="hidden"
                 />

                 {(isEditing || userRole === 'INSTRUCTOR') && (
                     <div className="absolute top-4 right-4 flex gap-2">
                         <button
                             onClick={() => audioInputRef.current?.click()}
                             disabled={isUploading}
                             className="p-2 bg-white/10 rounded hover:bg-white/20 text-white flex items-center gap-2"
                             title="Fazer upload de áudio"
                         >
                             {isUploading ? (
                                 <span className="animate-spin material-symbols-outlined">progress_activity</span>
                             ) : (
                                 <span className="material-symbols-outlined">upload</span>
                             )}
                         </button>
                     </div>
                 )}
                 <div className="flex items-center gap-6">
                    <div className="size-24 bg-gray-800 rounded-xl flex items-center justify-center">
                       <span className="material-symbols-outlined text-4xl text-primary">headphones</span>
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-white">{content?.title || 'Áudio'}</h3>
                       <p className="text-gray-400 mt-1">{content?.description || 'Conteúdo de áudio'}</p>
                    </div>
                 </div>

                 {/* Player de áudio real */}
                 {(generatedAudioUrl || content?.audio_url || (content?.content_url && (content.type === 'audio' || content.content_url.match(/\.(mp3|wav|ogg|aac|m4a)$/i)))) ? (
                     <div className="w-full space-y-4">
                         <audio
                             src={generatedAudioUrl || content?.audio_url || content?.content_url}
                             controls
                             className="w-full h-14 rounded-lg"
                             style={{ filter: 'invert(1)' }}
                         >
                             Seu navegador não suporta o elemento de áudio.
                         </audio>
                         {generatedAudioUrl && (
                             <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                                 <p className="text-green-300 text-sm font-medium">Áudio gerado com sucesso!</p>
                                 <p className="text-green-400/70 text-xs mt-1">O áudio foi salvo automaticamente.</p>
                             </div>
                         )}
                         {isEditing && (
                             <div className="flex justify-center">
                                 <button
                                     onClick={() => audioInputRef.current?.click()}
                                     disabled={isUploading}
                                     className="text-xs bg-white/10 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                                 >
                                     <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                                     Trocar Áudio
                                 </button>
                             </div>
                         )}
                     </div>
                 ) : (
                     /* Placeholder quando não há áudio */
                     <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                         {isUploading ? (
                             <>
                                 <span className="animate-spin material-symbols-outlined text-4xl mb-2 text-primary">progress_activity</span>
                                 <p className="text-sm font-bold text-white">Enviando áudio...</p>
                                 <p className="text-xs mt-1">Aguarde o upload finalizar</p>
                             </>
                         ) : isGeneratingAudio ? (
                             <>
                                 <div className="flex gap-1 mb-4">
                                     <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                     <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                     <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                 </div>
                                 <p className="text-sm font-bold text-white">Gerando áudio com IA...</p>
                                 <p className="text-xs mt-1">Isso pode levar até 2 minutos</p>
                             </>
                         ) : userRole === 'INSTRUCTOR' ? (
                             <>
                                 {/* Opção 1: Upload de arquivo */}
                                 <button
                                     onClick={() => audioInputRef.current?.click()}
                                     className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors mb-4"
                                 >
                                     <span className="material-symbols-outlined">upload</span>
                                     Fazer Upload de Áudio
                                 </button>
                                 <p className="text-xs mb-6">MP3, WAV, OGG, AAC (máx. 100MB)</p>

                                 {/* Divider */}
                                 <div className="flex items-center gap-4 w-full max-w-sm mb-6">
                                     <div className="flex-1 h-px bg-gray-600"></div>
                                     <span className="text-xs text-gray-500 uppercase">ou</span>
                                     <div className="flex-1 h-px bg-gray-600"></div>
                                 </div>

                                 {/* Opção 2: Gerar com IA */}
                                 {content?.text_content ? (
                                     <div className="text-center">
                                         <p className="text-xs text-gray-400 mb-3">Gerar áudio automaticamente a partir do texto</p>
                                         <div className="flex items-center gap-2 justify-center">
                                             <select
                                                 value={ttsStyle}
                                                 onChange={(e) => setTtsStyle(e.target.value as any)}
                                                 className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-600 focus:border-primary outline-none"
                                             >
                                                 <option value="podcast">Estilo Podcast</option>
                                                 <option value="resumo">Resumo</option>
                                                 <option value="explicacao">Explicação</option>
                                             </select>
                                             <button
                                                 onClick={handleGenerateAudio}
                                                 className="bg-primary text-harven-dark px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors"
                                             >
                                                 <span className="material-symbols-outlined">auto_awesome</span>
                                                 Gerar com IA
                                             </button>
                                         </div>
                                         <p className="text-[10px] text-gray-500 mt-2">Usa ElevenLabs para criar narração do conteúdo</p>
                                     </div>
                                 ) : (
                                     <p className="text-xs text-gray-500">Adicione conteúdo de texto para poder gerar áudio com IA</p>
                                 )}

                                 {/* Erro */}
                                 {ttsError && (
                                     <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mt-4 max-w-sm">
                                         <p className="text-red-300 text-xs">{ttsError}</p>
                                         <button
                                             onClick={() => setTtsError(null)}
                                             className="text-xs text-red-400 hover:text-red-300 mt-1 underline"
                                         >
                                             Fechar
                                         </button>
                                     </div>
                                 )}
                             </>
                         ) : (
                             <>
                                 <span className="material-symbols-outlined text-4xl mb-2">music_off</span>
                                 <p className="text-sm font-bold">Nenhum áudio disponível</p>
                                 <p className="text-xs mt-1">O instrutor ainda não adicionou um áudio.</p>
                             </>
                         )}
                     </div>
                 )}
              </div>
          )}

          {/* Botão de Marcar como Concluído */}
          <div className="flex justify-center py-8">
            <button
              onClick={() => saveStudyTime(true)}
              disabled={isContentCompleted}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                isContentCompleted
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-default'
                  : 'bg-primary text-harven-dark hover:bg-primary-dark hover:scale-105 shadow-lg shadow-primary/30'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isContentCompleted ? 'check_circle' : 'task_alt'}
              </span>
              {isContentCompleted ? 'Conteúdo Concluído!' : 'Marcar como Concluído'}
            </button>
          </div>

          {/* Socratic Trigger Section */}
          <section className="mt-8 pb-8 pt-10 border-t border-harven-border animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-harven-dark flex items-center justify-center text-primary shadow-lg">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-harven-dark">Desafio Socrático</h3>
                        <p className="text-sm text-gray-500">
                          {lockedQuestionId
                            ? 'Você iniciou uma conversa. Continue ou reinicie para escolher outra pergunta.'
                            : 'Selecione um tópico para debater com a IA e validar seu aprendizado.'}
                        </p>
                    </div>
               </div>
               <div className="flex items-center gap-2">
                   {lockedQuestionId && (
                       <button
                           onClick={resetConversation}
                           className="px-4 py-2 border border-red-200 text-red-600 font-bold rounded-lg text-xs uppercase hover:bg-red-50 transition-all flex items-center gap-2"
                       >
                           <span className="material-symbols-outlined text-[16px]">refresh</span> Reiniciar Conversa
                       </button>
                   )}
                   {isEditing && (
                       <button className="px-4 py-2 border border-dashed border-primary text-primary-dark font-bold rounded-lg text-xs uppercase hover:bg-primary/5 transition-all flex items-center gap-2">
                           <span className="material-symbols-outlined">add</span> Nova Pergunta
                       </button>
                   )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socraticQuestions.map((q) => {
                const isLocked = lockedQuestionId && lockedQuestionId !== q.id;
                const isSelected = selectedQuestion === q.question && !isEditing;
                const isActive = lockedQuestionId === q.id;

                return (
                <button
                  key={q.id}
                  onClick={() => handleQuestionSelect(q.id, q.question)}
                  disabled={isLocked}
                  className={`relative p-6 rounded-xl text-left border transition-all duration-300 group overflow-hidden ${
                    isSelected
                      ? 'bg-harven-dark border-harven-dark ring-2 ring-primary ring-offset-2'
                      : isLocked
                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        : isActive
                          ? 'bg-primary/10 border-primary'
                          : 'bg-white border-harven-border hover:border-primary hover:shadow-md'
                  }`}
                >
                  {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/60">
                          <span className="material-symbols-outlined text-gray-400 text-3xl">lock</span>
                      </div>
                  )}

                  {isEditing && !isLocked && (
                      <div className="absolute top-2 right-2 flex gap-1 z-20">
                          <div className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-500"><span className="material-symbols-outlined text-[16px]">edit</span></div>
                          <div className="p-1.5 bg-red-50 rounded-md hover:bg-red-100 text-red-500"><span className="material-symbols-outlined text-[16px]">delete</span></div>
                      </div>
                  )}

                  <div className={`absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 ${isSelected ? 'text-white' : 'text-harven-dark'}`}>
                     <span className="material-symbols-outlined text-[64px]">{q.icon}</span>
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                     <span className={`material-symbols-outlined text-[28px] ${isSelected ? 'text-primary' : isActive ? 'text-primary-dark' : 'text-gray-400 group-hover:text-primary-dark'}`}>
                       {q.icon}
                     </span>
                     <div>
                        <h4 className={`font-bold text-sm mb-2 leading-tight ${isSelected ? 'text-white' : 'text-harven-dark'}`}>
                          {q.question}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                          {q.description}
                        </p>
                     </div>
                     
                     <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-2 ${selectedQuestion === q.question && !isEditing ? 'text-primary' : 'text-gray-300 group-hover:text-primary-dark'}`}>
                        {isEditing ? 'Editar Configuração' : selectedQuestion === q.question ? 'Em Discussão' : 'Iniciar Debate'} 
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                     </div>
                  </div>
                </button>
              );
              })}
            </div>

            {/* INLINE SOCRATIC CHAT - Aparece dentro do fluxo do conteúdo */}
            {selectedQuestion && !isEditing && (
              <section className="mt-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl border border-harven-border shadow-lg overflow-hidden">
                  {/* Header do Chat Inline */}
                  <div className="bg-harven-dark p-5 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="relative">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                          <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-harven-dark"></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white text-base font-bold">Diálogo Socrático</h3>
                          <span className="bg-white/10 text-[9px] font-bold px-2 py-0.5 rounded text-gray-300 border border-white/5 uppercase">Beta</span>
                        </div>
                        <p className="text-primary/80 text-xs mt-0.5 line-clamp-1" title={selectedQuestion}>
                          {selectedQuestion}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                      {/* Contador de Interações */}
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 border border-white/5">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">Interações</span>
                        <div className="flex gap-1">
                          {[...Array(MAX_INTERACTIONS)].map((_, i) => (
                            <div key={i} className={`size-2 rounded-full ${i < interactionCount ? 'bg-red-500' : 'bg-primary'}`}></div>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-white ml-1">{interactionCount}/{MAX_INTERACTIONS}</span>
                      </div>

                      <button
                        onClick={closeChat}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all p-2 rounded-lg"
                        title="Fechar Debate"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                  </div>

                  {/* Área de Mensagens */}
                  <div className="p-6 bg-[#fafaf8] min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-5">
                      {chatMessages.map((msg, index) => (
                        <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                          {msg.role === 'ai' ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-harven-gold uppercase tracking-[0.15em]">Socrates AI</span>
                                <span className="text-[9px] font-bold text-gray-300">
                                  {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="bg-white border border-harven-border p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] relative">
                                {index === 0 && (
                                  <span className="absolute top-3 left-3 text-4xl font-display text-gray-100 -z-10 select-none">"</span>
                                )}
                                <p className="text-sm text-harven-dark leading-relaxed whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-harven-dark text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[85%]">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                              </div>
                              <span className="text-[9px] font-bold text-gray-400 mr-2 uppercase">
                                Você • {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </>
                          )}
                        </div>
                      ))}

                      {/* Indicador de IA pensando */}
                      {isAiThinking && (
                        <div className="flex flex-col gap-2 items-start animate-in fade-in duration-300">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-harven-gold uppercase tracking-[0.15em]">Socrates AI</span>
                          </div>
                          <div className="bg-white border border-harven-border p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                              <span className="text-xs text-gray-400 ml-2">
                                {isCheckingAI ? 'Verificando resposta...' : 'Pensando...'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Erro no chat */}
                      {chatError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs text-center">
                          {chatError}
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-5 bg-white border-t border-harven-border">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-harven-gold rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative flex items-end gap-3">
                        <textarea
                          ref={chatInputRef}
                          onKeyDown={handleKeyDown}
                          disabled={interactionCount >= MAX_INTERACTIONS}
                          className="flex-1 bg-harven-bg border border-harven-border rounded-xl p-4 text-sm text-harven-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/30 focus:border-primary min-h-[60px] max-h-[120px] resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder={interactionCount >= MAX_INTERACTIONS ? "Limite de interações atingido para este tópico." : "Digite sua resposta aqui..."}
                        />
                        <div className="flex flex-col gap-2 pb-1">
                          {interactionCount < MAX_INTERACTIONS ? (
                            <button
                              onClick={handleSend}
                              className="h-12 w-12 bg-primary rounded-xl text-harven-dark shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                              title="Enviar"
                            >
                              <span className="material-symbols-outlined fill-1 text-[20px]">send</span>
                            </button>
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-xl text-gray-400 flex items-center justify-center cursor-not-allowed">
                              <span className="material-symbols-outlined text-[20px]">block</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        {interactionCount >= MAX_INTERACTIONS
                          ? "Ciclo socrático completado"
                          : "Enter para enviar • Shift+Enter para quebrar linha"}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-1.5 rounded-full ${interactionCount >= MAX_INTERACTIONS ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className="text-[9px] font-bold text-gray-500 uppercase">
                          {interactionCount >= MAX_INTERACTIONS ? "Fechado" : "Ativo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;
