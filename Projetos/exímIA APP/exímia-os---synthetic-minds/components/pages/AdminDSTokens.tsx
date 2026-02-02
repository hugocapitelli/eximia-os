import React, { useState } from 'react';
import { Palette, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';

interface TokenCategory {
  id: string;
  name: string;
  tokens: {
    name: string;
    value: string;
    cssVar?: string;
  }[];
}

const DESIGN_TOKENS: TokenCategory[] = [
  {
    id: 'colors-brand',
    name: 'Colors - Brand',
    tokens: [
      { name: 'primary', value: '#f59e0b', cssVar: '--color-primary' },
      { name: 'primary-hover', value: '#fbbf24', cssVar: '--color-primary-hover' },
      { name: 'primary-muted', value: 'rgba(245, 158, 11, 0.1)', cssVar: '--color-primary-muted' },
    ],
  },
  {
    id: 'colors-background',
    name: 'Colors - Background',
    tokens: [
      { name: 'bg-base', value: '#050505', cssVar: '--color-bg-base' },
      { name: 'bg-elevated', value: '#0A0A0A', cssVar: '--color-bg-elevated' },
      { name: 'bg-overlay', value: 'rgba(0, 0, 0, 0.8)', cssVar: '--color-bg-overlay' },
    ],
  },
  {
    id: 'colors-border',
    name: 'Colors - Border',
    tokens: [
      { name: 'border-default', value: '#1F1F22', cssVar: '--color-border-default' },
      { name: 'border-hover', value: '#3f3f46', cssVar: '--color-border-hover' },
      { name: 'border-active', value: 'rgba(245, 158, 11, 0.5)', cssVar: '--color-border-active' },
    ],
  },
  {
    id: 'colors-text',
    name: 'Colors - Text',
    tokens: [
      { name: 'text-primary', value: '#ffffff', cssVar: '--color-text-primary' },
      { name: 'text-secondary', value: '#a1a1aa', cssVar: '--color-text-secondary' },
      { name: 'text-muted', value: '#71717a', cssVar: '--color-text-muted' },
      { name: 'text-disabled', value: '#52525b', cssVar: '--color-text-disabled' },
    ],
  },
  {
    id: 'colors-semantic',
    name: 'Colors - Semantic',
    tokens: [
      { name: 'success', value: '#10b981', cssVar: '--color-success' },
      { name: 'warning', value: '#f59e0b', cssVar: '--color-warning' },
      { name: 'error', value: '#ef4444', cssVar: '--color-error' },
      { name: 'info', value: '#3b82f6', cssVar: '--color-info' },
    ],
  },
  {
    id: 'spacing',
    name: 'Spacing',
    tokens: [
      { name: 'spacing-xs', value: '4px', cssVar: '--spacing-xs' },
      { name: 'spacing-sm', value: '8px', cssVar: '--spacing-sm' },
      { name: 'spacing-md', value: '16px', cssVar: '--spacing-md' },
      { name: 'spacing-lg', value: '24px', cssVar: '--spacing-lg' },
      { name: 'spacing-xl', value: '32px', cssVar: '--spacing-xl' },
      { name: 'spacing-2xl', value: '48px', cssVar: '--spacing-2xl' },
    ],
  },
  {
    id: 'radius',
    name: 'Border Radius',
    tokens: [
      { name: 'radius-sm', value: '4px', cssVar: '--radius-sm' },
      { name: 'radius-md', value: '8px', cssVar: '--radius-md' },
      { name: 'radius-lg', value: '12px', cssVar: '--radius-lg' },
      { name: 'radius-xl', value: '16px', cssVar: '--radius-xl' },
      { name: 'radius-2xl', value: '24px', cssVar: '--radius-2xl' },
      { name: 'radius-full', value: '9999px', cssVar: '--radius-full' },
    ],
  },
  {
    id: 'typography',
    name: 'Typography',
    tokens: [
      { name: 'font-sans', value: 'Inter, system-ui, sans-serif', cssVar: '--font-sans' },
      { name: 'font-serif', value: 'Playfair Display, Georgia, serif', cssVar: '--font-serif' },
      { name: 'font-mono', value: 'JetBrains Mono, monospace', cssVar: '--font-mono' },
    ],
  },
  {
    id: 'shadows',
    name: 'Shadows',
    tokens: [
      { name: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.3)', cssVar: '--shadow-sm' },
      { name: 'shadow-md', value: '0 4px 12px rgba(0,0,0,0.4)', cssVar: '--shadow-md' },
      { name: 'shadow-lg', value: '0 8px 32px rgba(0,0,0,0.5)', cssVar: '--shadow-lg' },
      { name: 'shadow-glow', value: '0 0 15px rgba(245,158,11,0.1)', cssVar: '--shadow-glow' },
    ],
  },
];

interface AdminDSTokensProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminDSTokens: React.FC<AdminDSTokensProps> = ({
  onBack,
  onNavigate,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    DESIGN_TOKENS.map((c) => c.id)
  );
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCopyValue = (value: string, tokenName: string) => {
    navigator.clipboard.writeText(value);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const isColor = (value: string) => {
    return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'DS Manager', onClick: onBack },
          { label: 'Tokens' },
        ]}
        onBack={onBack}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Palette}
          title="Design Tokens"
          description="Tokens semânticos do Design System. Cores, espaçamentos, tipografia e mais."
          showDefaultActions={false}
        />

        {/* Token Categories */}
        <div className="space-y-4">
          {DESIGN_TOKENS.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            return (
              <div
                key={category.id}
                className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-zinc-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-zinc-500" />
                    )}
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded">
                      {category.tokens.length} tokens
                    </span>
                  </div>
                </button>

                {/* Token List */}
                {isExpanded && (
                  <div className="border-t border-[#1F1F22]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-zinc-500 uppercase tracking-wider">
                          <th className="text-left px-4 py-3 font-medium">Token</th>
                          <th className="text-left px-4 py-3 font-medium">Value</th>
                          <th className="text-left px-4 py-3 font-medium">CSS Variable</th>
                          <th className="text-right px-4 py-3 font-medium">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.tokens.map((token) => (
                          <tr
                            key={token.name}
                            className="border-t border-[#1F1F22] hover:bg-white/5 transition-colors group"
                          >
                            <td className="px-4 py-3">
                              <code className="text-sm text-amber-500">{token.name}</code>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <code className="text-sm text-zinc-400">{token.value}</code>
                                <button
                                  onClick={() => handleCopyValue(token.value, token.name)}
                                  className="p-1 text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                  title="Copiar valor"
                                >
                                  {copiedToken === token.name ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {token.cssVar && (
                                <code className="text-sm text-zinc-600">var({token.cssVar})</code>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {isColor(token.value) && (
                                <div
                                  className="inline-block w-8 h-8 rounded-lg border border-zinc-700"
                                  style={{ backgroundColor: token.value }}
                                  title={token.value}
                                />
                              )}
                              {!isColor(token.value) && token.name.includes('radius') && (
                                <div
                                  className="inline-block w-8 h-8 bg-amber-500/20 border border-amber-500/30"
                                  style={{ borderRadius: token.value }}
                                />
                              )}
                              {!isColor(token.value) && token.name.includes('shadow') && (
                                <div
                                  className="inline-block w-8 h-8 bg-zinc-800 rounded-lg"
                                  style={{ boxShadow: token.value }}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDSTokens;
