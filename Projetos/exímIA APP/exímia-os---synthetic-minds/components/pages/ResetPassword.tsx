import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase/client';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const getPasswordStrength = (password: string) => {
  if (password.length < 6) return { label: 'Muito fraca', color: 'bg-red-500', width: '20%' };
  if (password.length < 8) return { label: 'Fraca', color: 'bg-orange-500', width: '40%' };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: 'Média', color: 'bg-yellow-500', width: '60%' };
  if (password.length >= 12) return { label: 'Muito forte', color: 'bg-green-500', width: '100%' };
  return { label: 'Forte', color: 'bg-green-400', width: '80%' };
};

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  useEffect(() => {
    // Verify we have a valid session from email link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setTokenValid(true);
      } else {
        toast.error('Link inválido ou expirado');
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success('Senha atualizada com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Erro ao atualizar senha. Tente novamente.');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-zinc-400">Verificando link...</p>
        </div>
      </div>
    );
  }

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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Nova senha
            </h1>
            <p className="text-sm text-zinc-400">
              Escolha uma senha forte para sua conta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nova senha"
                label="Nova senha"
                required
                disabled={loading}
                size="lg"
                icon={<Lock className="w-5 h-5" />}
              />
              {password && (
                <div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">{passwordStrength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha"
              label="Confirmar senha"
              required
              disabled={loading}
              size="lg"
              icon={
                passwordsMatch ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5" />
                )
              }
              error={confirmPassword && !passwordsMatch ? 'Senhas não coincidem' : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !passwordsMatch}
              className="w-full !bg-amber-500 hover:!bg-amber-600 !text-black"
            >
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
