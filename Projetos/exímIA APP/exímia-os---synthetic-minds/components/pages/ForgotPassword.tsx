import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase/client';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      toast.error('Erro ao enviar email. Tente novamente.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl will-change-transform" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-[#0A0A0B] border border-zinc-900 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Recuperar senha
                </h1>
                <p className="text-sm text-zinc-400">
                  Digite seu email para receber o link de recuperação
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  label="Email"
                  required
                  disabled={loading}
                  size="lg"
                  icon={<Mail className="w-5 h-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full !bg-amber-500 hover:!bg-amber-600 !text-black"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                  <Mail className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Email enviado!
                </h1>
                <p className="text-sm text-zinc-400 mb-8">
                  Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                </p>
                <p className="text-xs text-zinc-500">
                  Não recebeu? Verifique a pasta de spam ou{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-amber-500 hover:text-amber-400 underline"
                  >
                    tente novamente
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider font-medium"
            >
              <ArrowLeft className="w-3 h-3" />
              Voltar para login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
