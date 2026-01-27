import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Heading,
  Text,
  CheckCircle,
  Target,
  TrendingUp,
  BookOpen,
} from "@/components/ui";
import { MetricCard, EntityLink } from "@/components/molecules";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <Heading level="h2">
          Olá, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário"}
        </Heading>
        <Text color="muted">
          Seu sistema operacional de produtividade com IA está pronto.
        </Text>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Metas Ativas"
          value="12"
          icon={<Target className="size-4" />}
          period="Este trimestre"
          change={15}
          changeLabel="vs. trimestre anterior"
        />
        <MetricCard
          label="Hábitos"
          value="87%"
          icon={<CheckCircle className="size-4" />}
          period="Esta semana"
          change={5}
          progress={87}
        />
        <MetricCard
          label="Aulas Concluídas"
          value="24"
          icon={<BookOpen className="size-4" />}
          period="Este mês"
          change={-3}
        />
        <MetricCard
          label="Produtividade"
          value="4.2h"
          icon={<TrendingUp className="size-4" />}
          period="Média diária"
          change={12}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Conexões Recentes</CardTitle>
          <CardDescription>Entidades conectadas no seu sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <EntityLink type="goal" id="1" label="Lançar MVP" />
            <EntityLink type="project" id="2" label="ExímIA OS" />
            <EntityLink type="habit" id="3" label="Meditação" />
            <EntityLink type="note" id="4" label="Ideias de Features" />
            <EntityLink type="agent" id="5" label="The Maestro" />
            <EntityLink type="resource" id="6" label="Atomic Habits" />
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="border-eximia-400/20">
        <CardHeader>
          <CardTitle className="text-eximia-400">FASE 0 - Fundação</CardTitle>
          <CardDescription>Progresso do desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="success" dot size="sm">Concluído</Badge>
                <Text size="sm">BLOCO 0.1-0.4: Setup + Design System</Text>
              </div>
              <Text size="xs" color="muted">4/6</Text>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="success" dot size="sm">Concluído</Badge>
                <Text size="sm">BLOCO 0.5: Molecules</Text>
              </div>
              <Text size="xs" color="muted">5/6</Text>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="success" dot size="sm">Concluído</Badge>
                <Text size="sm">BLOCO 0.6: Layout Shell</Text>
              </div>
              <Text size="xs" color="muted">6/6</Text>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-eximia-500 to-eximia-400 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
              <Text size="xs" color="muted" className="mt-2 text-center">
                FASE 0 completa! Pronto para FASE 1 - Core
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
