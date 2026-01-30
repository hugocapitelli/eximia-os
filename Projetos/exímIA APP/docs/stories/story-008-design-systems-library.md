# Story EXIMIA-008: Design Systems Library

**Story ID:** EXIMIA-008
**Epic:** EXIMIA-EPIC-002 (Design System Foundation)
**Sprint:** 2
**Pontos:** 13
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-007 (Templates & Layouts)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ter uma biblioteca de Design Systems funcional,
**Para que** eu possa visualizar, comparar e aplicar design systems aos meus projetos.

---

## Contexto

O protótipo atual (`synthetic-minds`) tem o DesignSystemViewer parcialmente funcional.
Esta story:
1. Adiciona 5+ Design Systems mockados
2. Implementa o Editor (atualmente stub)
3. Adiciona funcionalidade real aos filtros/busca
4. Implementa export JSON/CSS

---

## Acceptance Criteria

### Library Page
- [ ] Grid de cards com 5+ Design Systems
- [ ] Busca funcional por nome/tags
- [ ] Filtros por categoria (Web, Mobile, Dashboard, Marketing)
- [ ] Admin mode com drag-drop reorder
- [ ] Multi-select com bulk actions
- [ ] Preview modal on hover (opcional)

### Viewer Page
- [ ] Overview section completo
- [ ] Identity section com FIVU
- [ ] Tokens section (Colors, Typography, Spacing, Radius)
- [ ] Library section com todos componentes
- [ ] Code snippets para TODOS componentes
- [ ] Copy code button funcional

### Editor Page
- [ ] Edit Identity (mission, vision, archetypes)
- [ ] Edit Tokens (color picker, typography)
- [ ] Add/Remove components
- [ ] Preview changes live
- [ ] Save changes (localStorage primeiro)
- [ ] Create new version

### Export
- [ ] Export as JSON
- [ ] Export as CSS variables
- [ ] Export as Tailwind config
- [ ] Download file dialog

### Mock Data
- [ ] eximia-os-v6 (já existe)
- [ ] harven-ai (SaaS B2B, Indigo)
- [ ] lendaria-os (Bold, Emerald)
- [ ] ecommerce-starter (Vibrant, Pink)
- [ ] corporate-minimal (Conservative, Blue)

---

## Technical Details

### Mock Data Expansion

```typescript
// constants.ts - Adicionar Design Systems

export const DESIGN_SYSTEMS: DesignSystem[] = [
  // 1. ExímIA OS v6 (já existe, manter)
  {
    id: "eximia-os-v6",
    name: "ExímIA OS v6 (Official)",
    version: "6.0.0",
    category: "Core System",
    // ... dados existentes
  },

  // 2. Harven AI
  {
    id: "harven-ai",
    name: "Harven AI Platform",
    version: "1.0.0",
    category: "SaaS",
    author: "ExímIA Design Team",
    tags: ["SaaS", "B2B", "Dashboard", "Corporate"],
    use_cases: ["Enterprise Training", "AI Platforms", "B2B SaaS"],
    tech_stack: ["React", "Tailwind CSS", "shadcn/ui"],
    philosophy: "Professional. Trustworthy. Innovative.",
    identity: {
      mission: "Democratizar treinamento corporativo com IA",
      vision: "Ser a plataforma de referência em corporate learning",
      archetypes: [
        { name: "Sage", description: "Conhecimento e expertise", motivation: "Entender o mundo", manifestation: "Dados, insights, clareza" },
        { name: "Creator", description: "Inovação e criatividade", motivation: "Criar valor duradouro", manifestation: "Soluções elegantes" },
      ],
    },
    tokens: {
      colors: [
        { name: "Primary", hex: "#6366F1", usage: "CTAs, highlights" },
        // Indigo scale
      ],
      typography: [
        { role: "Display", font: "Inter", weight: "700", size: "3rem" },
        // ...
      ],
      spacing: [
        { name: "xs", value: "4px", tailwind: "space-1" },
        // ...
      ],
      radius: [
        { name: "sm", value: "4px", tailwind: "rounded-sm" },
        // ...
      ],
    },
    components: [
      { id: "button", name: "Button", type: "Atom", status: "Stable", description: "Primary action button" },
      // ...
    ],
  },

  // 3. Lendária OS
  {
    id: "lendaria-os",
    name: "Lendária OS",
    version: "2.0.0",
    category: "Education",
    author: "Academia Lendária",
    tags: ["Education", "Bold", "Rebel", "Dark Mode"],
    use_cases: ["E-learning", "Community Platforms", "Course Platforms"],
    tech_stack: ["React", "Tailwind CSS", "Framer Motion"],
    philosophy: "Desafiador. Ousado. Transformador.",
    identity: {
      mission: "Unir pessoas lendárias com IA",
      vision: "Referência global em educação de IA generativa",
      founder: "Alan Nicolas",
      since: "15/01/2020",
      corpus: "15.832 palavras",
      archetypes: [
        { name: "Rebel", description: "Desafiar o status quo", motivation: "Recusar a mediocridade", manifestation: "Enquanto muitos os chamam de loucos, nós os reconhecemos como gênios" },
        { name: "Magician", description: "Transformar realidade", motivation: "Conhecimento em revolução", manifestation: "Alquimistas do conhecimento" },
        { name: "Sage", description: "Buscar a verdade", motivation: "Transparência radical", manifestation: "Contexto, não controle" },
      ],
    },
    tokens: {
      colors: [
        { name: "Primary", hex: "#10B981", usage: "CTAs, success states" },
        // Emerald scale
      ],
      // ...
    },
    components: [
      // ...
    ],
  },

  // 4. E-commerce Starter
  {
    id: "ecommerce-starter",
    name: "E-commerce Starter Kit",
    version: "1.0.0",
    category: "E-commerce",
    author: "ExímIA Design Team",
    tags: ["E-commerce", "Modern", "Vibrant", "Mobile-first"],
    use_cases: ["Online Stores", "Marketplaces", "Product Catalogs"],
    tech_stack: ["React", "Tailwind CSS", "Stripe"],
    philosophy: "Moderno. Vibrante. Conversão otimizada.",
    identity: {
      mission: "Acelerar vendas online com design que converte",
      vision: "Kit de partida para qualquer e-commerce",
      archetypes: [
        { name: "Lover", description: "Conexão emocional", motivation: "Criar desejo", manifestation: "Visual atraente, experiência sensorial" },
      ],
    },
    tokens: {
      colors: [
        { name: "Primary", hex: "#EC4899", usage: "CTAs, highlights" },
        // Pink scale
      ],
      // ...
    },
    components: [
      // ...
    ],
  },

  // 5. Corporate Minimal
  {
    id: "corporate-minimal",
    name: "Corporate Minimal",
    version: "1.0.0",
    category: "Corporate",
    author: "ExímIA Design Team",
    tags: ["Corporate", "Minimal", "Professional", "Enterprise"],
    use_cases: ["Corporate Websites", "Investor Relations", "Enterprise Apps"],
    tech_stack: ["React", "Tailwind CSS"],
    philosophy: "Confiança. Clareza. Profissionalismo.",
    identity: {
      mission: "Transmitir confiança e solidez através do design",
      vision: "O padrão para comunicação corporativa",
      archetypes: [
        { name: "Ruler", description: "Controle e estabilidade", motivation: "Ordem e sucesso", manifestation: "Design estruturado, hierarquia clara" },
      ],
    },
    tokens: {
      colors: [
        { name: "Primary", hex: "#3B82F6", usage: "CTAs, links" },
        // Blue scale
      ],
      // ...
    },
    components: [
      // ...
    ],
  },
];
```

### Editor Implementation

```tsx
// components/design-system/DesignSystemEditor.tsx
import { useState } from "react";
import { Button, Input, Textarea, Icon, Card } from "@/components/ui";
import type { DesignSystem } from "@/types";

interface DesignSystemEditorProps {
  designSystem: DesignSystem;
  onSave: (ds: DesignSystem) => void;
  onCancel: () => void;
}

export function DesignSystemEditor({ designSystem, onSave, onCancel }: DesignSystemEditorProps) {
  const [editedDS, setEditedDS] = useState<DesignSystem>(designSystem);
  const [activeSection, setActiveSection] = useState<"identity" | "tokens" | "components">("identity");

  const handleSave = () => {
    onSave(editedDS);
    // Save to localStorage
    const savedDS = JSON.parse(localStorage.getItem("design-systems") || "[]");
    const index = savedDS.findIndex((ds: DesignSystem) => ds.id === editedDS.id);
    if (index >= 0) {
      savedDS[index] = editedDS;
    } else {
      savedDS.push(editedDS);
    }
    localStorage.setItem("design-systems", JSON.stringify(savedDS));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">Editando: {editedDS.name}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleSave}>
            <Icon name="Save" size={16} /> Salvar
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-zinc-800">
        {(["identity", "tokens", "components"] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-3 text-sm font-medium capitalize ${
              activeSection === section
                ? "text-eximia-400 border-b-2 border-eximia-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeSection === "identity" && (
          <IdentityEditor
            identity={editedDS.identity}
            onChange={(identity) => setEditedDS({ ...editedDS, identity })}
          />
        )}

        {activeSection === "tokens" && (
          <TokensEditor
            tokens={editedDS.tokens}
            onChange={(tokens) => setEditedDS({ ...editedDS, tokens })}
          />
        )}

        {activeSection === "components" && (
          <ComponentsEditor
            components={editedDS.components}
            onChange={(components) => setEditedDS({ ...editedDS, components })}
          />
        )}
      </div>
    </div>
  );
}

function IdentityEditor({ identity, onChange }: { identity: any; onChange: (i: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Missão</label>
        <Textarea
          value={identity.mission}
          onChange={(e) => onChange({ ...identity, mission: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Visão</label>
        <Textarea
          value={identity.vision}
          onChange={(e) => onChange({ ...identity, vision: e.target.value })}
          rows={3}
        />
      </div>
      {/* Archetypes editor... */}
    </div>
  );
}

function TokensEditor({ tokens, onChange }: { tokens: any; onChange: (t: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Color Editor */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-white mb-4">Colors</h3>
          <div className="space-y-3">
            {tokens.colors.map((color: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => {
                    const newColors = [...tokens.colors];
                    newColors[index] = { ...color, hex: e.target.value };
                    onChange({ ...tokens, colors: newColors });
                  }}
                  className="w-10 h-10 rounded border-0 cursor-pointer"
                />
                <Input
                  value={color.name}
                  onChange={(e) => {
                    const newColors = [...tokens.colors];
                    newColors[index] = { ...color, name: e.target.value };
                    onChange({ ...tokens, colors: newColors });
                  }}
                  className="flex-1"
                />
                <Input
                  value={color.hex}
                  onChange={(e) => {
                    const newColors = [...tokens.colors];
                    newColors[index] = { ...color, hex: e.target.value };
                    onChange({ ...tokens, colors: newColors });
                  }}
                  className="w-28"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Typography Editor... */}
    </div>
  );
}

function ComponentsEditor({ components, onChange }: { components: any[]; onChange: (c: any[]) => void }) {
  return (
    <div className="space-y-4">
      {components.map((component, index) => (
        <Card key={component.id}>
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="font-medium text-white">{component.name}</span>
              <span className="ml-2 text-xs text-zinc-500">{component.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={component.status === "Stable" ? "success" : "warning"}>
                {component.status}
              </Badge>
              <Button variant="ghost" size="sm">
                <Icon name="Edit" size={14} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Trash" size={14} />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="secondary" className="w-full">
        <Icon name="Plus" size={16} /> Add Component
      </Button>
    </div>
  );
}
```

### Export Functions

```typescript
// lib/design-system-export.ts

export function exportAsJSON(ds: DesignSystem): string {
  return JSON.stringify(ds, null, 2);
}

export function exportAsCSS(ds: DesignSystem): string {
  let css = `/* ${ds.name} v${ds.version} */\n\n:root {\n`;

  // Colors
  ds.tokens.colors.forEach((color, i) => {
    css += `  --${ds.id}-color-${i}: ${color.hex};\n`;
  });

  css += "\n";

  // Typography
  ds.tokens.typography.forEach((t) => {
    css += `  --${ds.id}-font-${t.role.toLowerCase()}: ${t.font};\n`;
    css += `  --${ds.id}-size-${t.role.toLowerCase()}: ${t.size};\n`;
  });

  css += "\n";

  // Spacing
  ds.tokens.spacing.forEach((s) => {
    css += `  --${ds.id}-space-${s.name}: ${s.value};\n`;
  });

  css += "\n";

  // Radius
  ds.tokens.radius.forEach((r) => {
    css += `  --${ds.id}-radius-${r.name}: ${r.value};\n`;
  });

  css += "}\n";

  return css;
}

export function exportAsTailwind(ds: DesignSystem): string {
  const config = {
    theme: {
      extend: {
        colors: {} as Record<string, string>,
        fontFamily: {} as Record<string, string[]>,
        spacing: {} as Record<string, string>,
        borderRadius: {} as Record<string, string>,
      },
    },
  };

  ds.tokens.colors.forEach((color, i) => {
    config.theme.extend.colors[`${ds.id}-${i}`] = color.hex;
  });

  ds.tokens.spacing.forEach((s) => {
    config.theme.extend.spacing[s.name] = s.value;
  });

  ds.tokens.radius.forEach((r) => {
    config.theme.extend.borderRadius[r.name] = r.value;
  });

  return `// tailwind.config.js\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

## Tasks

- [ ] Expandir `constants.ts` com 4 novos Design Systems
- [ ] Implementar busca funcional na Library page
- [ ] Implementar filtros por categoria
- [ ] Implementar `DesignSystemEditor` completo
- [ ] Adicionar color picker no editor
- [ ] Adicionar code snippets para todos 6 componentes
- [ ] Implementar export JSON
- [ ] Implementar export CSS variables
- [ ] Implementar export Tailwind config
- [ ] Adicionar download dialog
- [ ] Testar persistência em localStorage

---

## Definition of Done

- [ ] 5+ Design Systems na Library
- [ ] Busca e filtros funcionais
- [ ] Editor salvando em localStorage
- [ ] Export em 3 formatos funcionando
- [ ] TypeScript sem erros
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
Projetos/exímIA APP/exímia-os---synthetic-minds/
├── constants.ts                           [MODIFY] ← Add 4 DS
├── components/
│   ├── design-system/
│   │   ├── DesignSystemEditor.tsx         [MODIFY] ← Full implementation
│   │   ├── IdentityEditor.tsx             [CREATE]
│   │   ├── TokensEditor.tsx               [CREATE]
│   │   └── ComponentsEditor.tsx           [CREATE]
│   └── pages/
│       └── DesignSystemLibrary.tsx        [MODIFY] ← Search/filter logic
├── lib/
│   └── design-system-export.ts            [CREATE]
└── types.ts                               [MODIFY] ← If needed
```

---

## Referências

- [PRD Design Systems Library](../../05_PrototypOS/PRD-Design-Systems-Library-v1.0.md)
- [PRD Design System](../../00_Core/PRD-Design-System-v5.0.md)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
