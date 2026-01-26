
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRole } from '../types';
import { contentsApi, questionsApi, uploadApi, aiApi } from '../services/api';

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

    // Se já contém HTML, retorna como está
    if (rawText.includes('<h1>') || rawText.includes('<h2>') || rawText.includes('<p>')) {
      return rawText;
    }

    // Divide o texto em linhas
    const lines = rawText.split('\n');
    let formattedHtml = '';
    let inList = false;
    let currentParagraph = '';
    let headingIndex = 0;

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        formattedHtml += `<p class="mb-4 text-gray-700 leading-relaxed">${currentParagraph.trim()}</p>`;
        currentParagraph = '';
      }
    };

    const closeList = () => {
      if (inList) {
        formattedHtml += '</ul>';
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const nextLine = lines[i + 1]?.trim() || '';

      // Linha vazia - fecha parágrafo atual
      if (!line) {
        closeList();
        flushParagraph();
        continue;
      }

      // Detecta títulos principais (ALL CAPS com mais de 3 palavras, ou linhas curtas em caps)
      const isAllCaps = line === line.toUpperCase() && line.length > 3 && /[A-Z]/.test(line);
      const isShortTitle = line.length < 60 && !line.endsWith('.') && !line.endsWith(',');

      // Títulos numerados como "1.", "1.1", "Capítulo 1", etc.
      const isNumberedTitle = /^(\d+\.?\d*\.?\s+|Capítulo\s+\d+|CAPÍTULO\s+\d+|Seção\s+\d+|SEÇÃO\s+\d+)/i.test(line);

      // Títulos com padrão de cabeçalho (linha curta seguida de linha vazia ou texto longo)
      const looksLikeTitle = isShortTitle && line.length < 80 && (
        !nextLine ||
        nextLine.length > line.length * 1.5 ||
        /^[A-Z]/.test(nextLine)
      );

      if (isAllCaps && isShortTitle) {
        closeList();
        flushParagraph();
        const headingId = `heading-${headingIndex++}`;
        formattedHtml += `<h2 id="${headingId}" class="toc-heading text-2xl font-display font-bold text-harven-dark mt-10 mb-4 pb-2 border-b border-harven-border scroll-mt-24">${line.charAt(0) + line.slice(1).toLowerCase()}</h2>`;
        continue;
      }

      if (isNumberedTitle) {
        closeList();
        flushParagraph();
        const headingId = `heading-${headingIndex++}`;
        // Detecta nível do título pelo número de pontos
        const dots = (line.match(/\./g) || []).length;
        if (dots <= 1) {
          formattedHtml += `<h3 id="${headingId}" class="toc-heading text-xl font-bold text-harven-dark mt-8 mb-3 flex items-center gap-2 scroll-mt-24"><span class="text-primary">§</span> ${line}</h3>`;
        } else {
          formattedHtml += `<h4 id="${headingId}" class="toc-heading text-lg font-semibold text-harven-dark mt-6 mb-2 pl-4 border-l-2 border-primary scroll-mt-24">${line}</h4>`;
        }
        continue;
      }

      // Detecta itens de lista (começa com -, *, •, ou número seguido de ) ou .)
      const isListItem = /^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line);

      if (isListItem) {
        flushParagraph();
        if (!inList) {
          formattedHtml += '<ul class="list-none space-y-2 my-4 pl-4">';
          inList = true;
        }
        const itemText = line.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, '');
        formattedHtml += `<li class="flex items-start gap-3"><span class="text-primary mt-1.5">●</span><span class="text-gray-700">${itemText}</span></li>`;
        continue;
      }

      // Detecta citações ou textos destacados (linhas que começam com " ou »)
      if (/^["»]/.test(line) || /[""]$/.test(line)) {
        closeList();
        flushParagraph();
        formattedHtml += `<blockquote class="border-l-4 border-harven-gold bg-harven-gold/5 pl-4 py-3 my-6 italic text-gray-600">${line}</blockquote>`;
        continue;
      }

      // Texto normal - acumula no parágrafo
      closeList();
      if (currentParagraph) {
        currentParagraph += ' ' + line;
      } else {
        currentParagraph = line;
      }

      // Se a linha termina com ponto e a próxima linha começa com maiúscula, fecha o parágrafo
      if (line.endsWith('.') && nextLine && /^[A-Z]/.test(nextLine) && nextLine.length > 50) {
        flushParagraph();
      }
    }

    // Fecha qualquer coisa pendente
    closeList();
    flushParagraph();

    // Se não gerou nada, retorna o texto original formatado de forma simples
    if (!formattedHtml.trim()) {
      return `<div class="space-y-4">${rawText.split('\n\n').map(p =>
        `<p class="text-gray-700 leading-relaxed">${p.trim()}</p>`
      ).join('')}</div>`;
    }

    return `<div class="formatted-content">${formattedHtml}</div>`;
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

        // Definir tipo de conteúdo baseado nos dados reais
        if (contentResult.type) {
          setContentType(contentResult.type.toUpperCase() as any);
        }

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
  };

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Iniciar chat quando uma pergunta é selecionada (sem chamar API)
  const initializeChat = (question: string) => {
    setChatMessages([]);
    setInteractionCount(0);
    setChatError(null);
    setIsAiThinking(false);

    // Mensagem inicial estática - não chama a API ainda
    // A API só será chamada quando o usuário enviar sua primeira resposta
    const initialMessage: ChatMessage = {
      id: `ai_${Date.now()}`,
      role: 'ai',
      content: `Vamos explorar juntos a questão:\n\n"${question}"\n\nAntes de compartilhar minha perspectiva, gostaria de ouvir a sua. O que você pensa sobre isso? Qual é seu entendimento inicial?`,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);
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
        console.log('AI Detection Result:', { probability: aiProbability, verdict: aiVerdict, isAIGenerated });
      } catch (e) {
        console.log('AI detection não disponível:', e);
      }
      setIsCheckingAI(false);

      // Se foi detectado como IA, mostrar aviso
      if (isAIGenerated) {
        const probabilityPercent = Math.round(aiProbability * 100);
        const warningMsg: ChatMessage = {
          id: `ai_warning_${Date.now()}`,
          role: 'ai',
          content: `⚠️ **Opa!** Parece que essa resposta foi gerada por uma IA (${probabilityPercent}% de probabilidade).\n\nO objetivo do método socrático é desenvolver seu próprio raciocínio crítico. Tente responder com suas próprias palavras - não precisa ser perfeito, o importante é o processo de reflexão!\n\nVamos tentar de novo?`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, warningMsg]);
        setInteractionCount(prev => prev - 1); // Não conta como interação válida
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
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: fallbackResponses[Math.min(newInteractionCount - 1, fallbackResponses.length - 1)],
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
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
                    <div className="text-center py-12 text-gray-400">
                        <span className="material-symbols-outlined text-6xl mb-4">notes</span>
                        <p className="text-lg font-bold">Texto não extraído</p>
                        <p className="text-sm mt-2">Use a visualização de arquivo para ver o conteúdo original.</p>
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
                 {content?.content_url && (content.type === 'audio' || content.content_url.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) ? (
                     <div className="w-full space-y-4">
                         <audio
                             src={content.content_url}
                             controls
                             className="w-full h-14 rounded-lg"
                             style={{ filter: 'invert(1)' }}
                         >
                             Seu navegador não suporta o elemento de áudio.
                         </audio>
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
                         ) : (isEditing || userRole === 'INSTRUCTOR') ? (
                             <>
                                 <button
                                     onClick={() => audioInputRef.current?.click()}
                                     className="bg-primary text-harven-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors mb-4"
                                 >
                                     <span className="material-symbols-outlined">upload</span>
                                     Adicionar Áudio
                                 </button>
                                 <p className="text-xs">Formatos suportados: MP3, WAV, OGG, AAC (máx. 100MB)</p>
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
