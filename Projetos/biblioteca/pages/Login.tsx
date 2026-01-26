import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Library } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="size-16 rounded-xl bg-primary/20 flex items-center justify-center mb-2 text-primary">
            <Library size={40} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            BIBLIOTECA
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Sua biblioteca física, digitalizada.
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6">
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-[#2c3b55] hover:bg-slate-50 dark:hover:bg-[#364663] text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 font-medium text-sm"
          >
            <svg className="size-5" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12.0003 20.45C16.6663 20.45 20.5841 17.2721 21.9961 13.0909H12.0003V10.9091H23.5786C23.6826 11.6033 23.7388 12.3168 23.7388 13.0909C23.7388 19.4673 18.4907 24 12.0003 24C5.37286 24 0 18.6274 0 12C0 5.37258 5.37286 0 12.0003 0C15.068 0 17.8427 1.05943 20.0632 2.87273L17.7018 5.23364C16.5166 4.29818 14.5152 3.27273 12.0003 3.27273C7.45233 3.27273 3.65476 6.76455 3.65476 12C3.65476 17.2355 7.45233 20.7273 12.0003 20.7273V20.45Z" fill="currentColor"></path>
            </svg>
            Continuar com Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm">ou continue com email</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input 
                id="email" 
                type="email" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-shadow" 
                placeholder="seu@email.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">Esqueceu a senha?</a>
              </div>
              <input 
                id="password" 
                type="password" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-shadow" 
                placeholder="••••••••"
              />
            </div>
            <button 
                type="submit"
                className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm shadow-primary/30"
            >
                Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Não tem uma conta? 
            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors ml-1">Criar conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;