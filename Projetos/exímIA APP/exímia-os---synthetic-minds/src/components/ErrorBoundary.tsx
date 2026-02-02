import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

// Route Error Component (for React Router error handling)
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Algo deu errado';
  let message = 'Ocorreu um erro inesperado.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Página não encontrada';
      message = 'A página que você está procurando não existe.';
    } else if (error.status === 403) {
      title = 'Acesso negado';
      message = 'Você não tem permissão para acessar esta página.';
    } else {
      title = `Erro ${error.status}`;
      message = error.statusText || 'Ocorreu um erro ao carregar a página.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-100 mb-2">{title}</h1>
        <p className="text-zinc-400 mb-8">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Início
          </button>
        </div>
      </div>
    </div>
  );
};

// Class-based Error Boundary (for catching render errors)
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Erro na aplicação</h1>
            <p className="text-zinc-400 mb-4">
              {this.state.error?.message || 'Ocorreu um erro inesperado.'}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
