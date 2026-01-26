import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

      {/* Status Card - Using new design system */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              Sistema Operacional
            </CardTitle>
            <Badge variant="success">Online</Badge>
          </div>
          <CardDescription>
            BLOCO 0.3 - Design System implementado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300">
            Design tokens, Tailwind theme e componentes shadcn/ui configurados com tema ExímIA.
          </p>
        </CardContent>
      </Card>

      {/* Design System Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Design System Demo</CardTitle>
          <CardDescription>Componentes com tema ExímIA Gold</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-400">Buttons</p>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-400">Badges</p>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-400">Input</p>
            <div className="max-w-sm">
              <Input placeholder="Digite algo..." />
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-400">ExímIA Gold Palette</p>
            <div className="flex gap-1">
              <div className="w-12 h-12 rounded bg-eximia-50" title="eximia-50" />
              <div className="w-12 h-12 rounded bg-eximia-100" title="eximia-100" />
              <div className="w-12 h-12 rounded bg-eximia-200" title="eximia-200" />
              <div className="w-12 h-12 rounded bg-eximia-300" title="eximia-300" />
              <div className="w-12 h-12 rounded bg-eximia-400" title="eximia-400" />
              <div className="w-12 h-12 rounded bg-eximia-500" title="eximia-500" />
              <div className="w-12 h-12 rounded bg-eximia-600" title="eximia-600" />
              <div className="w-12 h-12 rounded bg-eximia-700" title="eximia-700" />
              <div className="w-12 h-12 rounded bg-eximia-800" title="eximia-800" />
              <div className="w-12 h-12 rounded bg-eximia-900" title="eximia-900" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="glow-eximia">Efeito Glow</Button>
        </CardFooter>
      </Card>

      {/* Next Steps */}
      <Card className="border-eximia-400/20">
        <CardHeader>
          <CardTitle className="text-eximia-400">Progresso da Fase 0</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-zinc-400">
            <li className="flex items-center gap-2">
              <Badge variant="success">Done</Badge>
              BLOCO 0.1: Setup & Infraestrutura
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="warning">WIP</Badge>
              BLOCO 0.2: Agent Service (FastAPI)
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="success">Done</Badge>
              BLOCO 0.3: Design Tokens
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Pending</Badge>
              BLOCO 0.4: Atoms
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Pending</Badge>
              BLOCO 0.5: Molecules
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Pending</Badge>
              BLOCO 0.6: Layout Shell
            </li>
          </ul>
        </CardContent>
      </Card>

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
