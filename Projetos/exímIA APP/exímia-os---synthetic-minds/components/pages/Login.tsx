import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../organisms/LoginForm';
import { useAuth } from '../../src/hooks/useAuth';
import { Mail, X, CheckCircle } from 'lucide-react';
import { Logo } from '../atoms/Logo';
import { supabase } from '../../src/lib/supabase/client';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { signIn, loading, session } = useAuth();
  const navigate = useNavigate();
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);

    if (!error) {
      return { error: null };
    }

    return { error };
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration - Optimized with amber accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl will-change-transform" />

        {/* Ambient grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      </div>

      {/* Login container */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo size="lg" />
        </div>

        {/* Login card with amber border accent */}
        <div className="bg-[#0A0A0B] border border-zinc-900 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle amber glow on top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Card Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-zinc-400">
              Faça login para continuar
            </p>
          </div>

          {/* Form */}
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>

        {/* Footer with access request link */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-zinc-500 tracking-wider">
            Plataforma privada · Acesso restrito
          </p>

          {/* Request Access Button */}
          <button
            onClick={() => setShowAccessModal(true)}
            className="inline-flex items-center gap-2 text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium uppercase tracking-wider group"
          >
            <Mail className="w-3 h-3 group-hover:scale-110 transition-transform" />
            Solicitar Acesso
          </button>
        </div>
      </div>

      {/* Access Request Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0A0A0B] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowAccessModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <Mail className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Solicitar Acesso
              </h2>
              <p className="text-sm text-zinc-400">
                Preencha o formulário abaixo e entraremos em contato
              </p>
            </div>

            {/* Form */}
            {!requestSubmitted ? (
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);

                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  company: formData.get('company') as string || null,
                  message: formData.get('message') as string || null,
                };

                try {
                  const { error } = await supabase
                    .from('access_requests')
                    .insert([data]);

                  if (error) {
                    if (error.code === '23505') {
                      toast.error('Este email já possui uma solicitação em análise');
                    } else {
                      toast.error('Erro ao enviar solicitação. Tente novamente.');
                    }
                    setIsSubmitting(false);
                    return;
                  }

                  setRequestSubmitted(true);
                  toast.success('Solicitação enviada com sucesso!');
                } catch (error) {
                  console.error('Error submitting access request:', error);
                  toast.error('Erro ao enviar solicitação. Tente novamente.');
                  setIsSubmitting(false);
                }
              }}>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="joao@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Minha Empresa LTDA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Por que você gostaria de acessar a plataforma?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Solicitação Enviada!
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Sua solicitação está em análise. Entraremos em contato em breve.
                </p>
                <button
                  onClick={() => {
                    setShowAccessModal(false);
                    setRequestSubmitted(false);
                  }}
                  className="text-sm text-amber-500 hover:text-amber-400 font-medium uppercase tracking-wider"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
