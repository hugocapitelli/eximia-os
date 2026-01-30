import React, { useState } from 'react';
import { Users, GripVertical, PenTool, Trash2, Link2, BookOpen } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';
import { AUTHORS_DATA } from '../../constants';
import { Author } from '../../types';

interface AdminLibraryAuthorsProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminLibraryAuthors: React.FC<AdminLibraryAuthorsProps> = ({
  onBack,
  onNavigate,
}) => {
  const [authors, setAuthors] = useState<Author[]>(AUTHORS_DATA);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleAddAuthor = () => {
    const newAuthor: Author = {
      id: `author-${Date.now()}`,
      name: 'Novo Autor',
      bio: 'Biografia do autor',
      avatarUrl: '',
      bookCount: 0,
      mindId: undefined,
    };
    setAuthors([...authors, newAuthor]);
    setHasUnsavedChanges(true);
    setEditingAuthor(newAuthor.id);
  };

  const handleDeleteAuthor = (authorId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este autor?')) {
      setAuthors(authors.filter((a) => a.id !== authorId));
      setHasUnsavedChanges(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Library Editor', onClick: onBack },
          { label: 'Gerenciar Autores' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Users}
          title="Gerenciar Autores"
          description="Gerencie autores da biblioteca e vincule-os a Synthetic Minds."
          onAddNew={handleAddAuthor}
          onGenerateAI={() => console.log('Generate with AI')}
          addNewLabel="Novo Autor"
        />

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authors.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">Nenhum autor cadastrado</p>
              <p className="text-zinc-600 text-sm mt-1">
                Clique em "Novo Autor" para começar
              </p>
            </div>
          ) : (
            authors.map((author) => (
              <div
                key={author.id}
                className={`
                  bg-[#0A0A0A] border rounded-xl p-5 transition-all
                  ${editingAuthor === author.id
                    ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                    : 'border-[#1F1F22] hover:border-zinc-700'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {author.avatarUrl ? (
                      <img
                        src={author.avatarUrl}
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-zinc-500">
                        {author.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{author.name}</h3>
                      {author.mindId && (
                        <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          Mind
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">{author.bio}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{author.bookCount} livros</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingAuthor(editingAuthor === author.id ? null : author.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        editingAuthor === author.id
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'text-zinc-500 hover:text-amber-500 hover:bg-white/5'
                      }`}
                      aria-label="Editar"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAuthor(author.id)}
                      className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {editingAuthor === author.id && (
                  <div className="mt-4 pt-4 border-t border-[#1F1F22]">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={author.name}
                          onChange={(e) => {
                            setAuthors(
                              authors.map((a) =>
                                a.id === author.id ? { ...a, name: e.target.value } : a
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Biografia
                        </label>
                        <textarea
                          value={author.bio}
                          onChange={(e) => {
                            setAuthors(
                              authors.map((a) =>
                                a.id === author.id ? { ...a, bio: e.target.value } : a
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          rows={3}
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          URL do Avatar
                        </label>
                        <input
                          type="text"
                          value={author.avatarUrl || ''}
                          onChange={(e) => {
                            setAuthors(
                              authors.map((a) =>
                                a.id === author.id ? { ...a, avatarUrl: e.target.value } : a
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Vincular a Mind (ID)
                        </label>
                        <input
                          type="text"
                          value={author.mindId || ''}
                          onChange={(e) => {
                            setAuthors(
                              authors.map((a) =>
                                a.id === author.id ? { ...a, mindId: e.target.value || undefined } : a
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="ex: gary-halbert"
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLibraryAuthors;
