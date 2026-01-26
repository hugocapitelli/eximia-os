import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Bem-vindo ao ExímIA OS
        </h2>
        <p className="mt-1 text-zinc-400">
          Logado como: {user?.email}
        </p>
      </div>

      {/* Status Card */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 font-medium">Sistema Operacional</span>
        </div>
        <p className="mt-4 text-zinc-300">
          O BLOCO 0.1 está completo. Autenticação funcionando com Supabase.
        </p>
      </div>

      {/* Next Steps */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Próximos Passos</h3>
        <ul className="space-y-2 text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="text-[#FDBF68]">→</span>
            BLOCO 0.2: Agent Service (FastAPI)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#FDBF68]">→</span>
            BLOCO 0.3: Design Tokens
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#FDBF68]">→</span>
            BLOCO 0.4-0.6: Design System completo
          </li>
        </ul>
      </div>

      {/* Debug Info */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
        <p className="text-xs text-zinc-500 font-mono">
          User ID: {user?.id}
        </p>
        <p className="text-xs text-zinc-500 font-mono">
          Created: {user?.created_at}
        </p>
      </div>
    </div>
  );
}
