
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { disciplinesApi } from '../services/api';

const InstructorList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Real Disciplines Data
  const [disciplines, setDisciplines] = useState<any[]>([]);

  // Carregar Disciplinas
  useEffect(() => {
    const load = async () => {
      try {
        const data = await disciplinesApi.list();
        setDisciplines(data);
      } catch (e) {
        console.error("Erro ao carregar disciplinas", e);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">Minhas Disciplinas</h2>
          <p className="text-muted-foreground">Disciplinas atribuídas a você para lecionar neste semestre.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-background border border-border rounded-lg p-1 flex shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`size-9 ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
            >
              <span className={`material-symbols-outlined text-[20px] ${viewMode === 'grid' ? 'fill-1' : ''}`}>grid_view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={`size-9 ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
            >
              <span className={`material-symbols-outlined text-[20px] ${viewMode === 'list' ? 'fill-1' : ''}`}>view_list</span>
            </Button>
          </div>
          {/* Create Button removed for Instructors as per business rule */}
        </div>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input icon="search" placeholder="Buscar disciplinas..." className="w-full" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-foreground">filter_list</span> Semestre <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </Button>
        </div>
      </Card>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.length === 0 && (
            <div className="col-span-full text-center py-10 opacity-60">
              <span className="material-symbols-outlined text-4xl mb-2">school</span>
              <p>Nenhuma disciplina encontrada.</p>
              <p className="text-xs">Se você deveria ter disciplinas, contate o administrador.</p>
            </div>
          )}

          {disciplines.map((discipline, i) => (
            <Card
              key={i}
              hoverEffect
              className="flex flex-col animate-in zoom-in-95 duration-300 relative h-full"
              onClick={() => navigate(`/instructor/class/${discipline.id}`)}
            >
              <div className="h-24 bg-gradient-to-br from-foreground to-foreground/80 p-5 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant={'success'} className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
                    Ativa
                  </Badge>
                </div>
                <div className="bg-background size-12 rounded-lg shadow-lg flex items-center justify-center text-foreground relative z-10 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <span className="material-symbols-outlined text-[32px]">{discipline.icon || 'school'}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary-dark transition-colors leading-tight line-clamp-1">
                  {discipline.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-bold">{discipline.code} • {discipline.department}</p>

                <div className="mt-8 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground">Gerenciar Turma</span>
                  <span className="material-symbols-outlined text-[18px] text-primary-dark">arrow_forward</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col gap-4 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="col-span-5">Turma</div>
            <div className="col-span-2">Código</div>
            <div className="col-span-2">Departamento</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>
          {disciplines.map((cls, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-border hover:bg-muted/20 items-center group transition-colors cursor-pointer" onClick={() => navigate(`/instructor/class/${cls.id}`)}>
              <div className="col-span-5 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground overflow-hidden">
                  <span className="material-symbols-outlined">{cls.icon || 'school'}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary-dark transition-colors">{cls.title}</h4>
                </div>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground font-medium">{cls.code}</div>
              <div className="col-span-2 text-sm text-muted-foreground font-medium">{cls.department}</div>
              <div className="col-span-2">
                <Badge variant={cls.status === 'active' || cls.status === 'Ativa' ? 'success' : 'default'}>{cls.status || 'Ativa'}</Badge>
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/instructor/class/${cls.id}`); }} className="size-8"><span className="material-symbols-outlined text-[18px]">arrow_forward</span></Button>
              </div>
            </div>
          ))}
          {disciplines.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma turma encontrada.</div>
          )}
        </Card>
      )}


    </div >
  );
};

export default InstructorList;
