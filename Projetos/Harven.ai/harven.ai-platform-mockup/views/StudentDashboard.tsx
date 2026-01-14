import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { dashboardApi, disciplinesApi } from '../services/api';

interface StatItem {
  label: string;
  val: string;
  icon: string;
  trend: string;
}

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await dashboardApi.getStats();
        setStats(statsData);
        const coursesData = await disciplinesApi.list();
        setCourses(coursesData);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-harven-dark dark:text-gray-100">Bem-vindo de volta, Aluno</h2>
          <p className="text-gray-500 mt-1">Continue sua jornada de aprendizado socrático hoje.</p>
        </div>
        <Button>
          <span className="material-symbols-outlined fill-1 text-[18px] mr-2">play_arrow</span>
          Retomar Estudos
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} hoverEffect className="p-5 flex flex-col gap-2">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              <span className="material-symbols-outlined text-harven-gold">{stat.icon}</span>
            </div>
            <p className="text-3xl font-display font-bold text-harven-dark dark:text-white">{stat.val}</p>
            <p className="text-[10px] font-bold text-green-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              {stat.trend}
            </p>
          </Card>
        ))}
      </div>

      {/* Curso em Destaque (Full Width) */}
      <Card className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative h-48 md:h-auto">
          <img src="https://picsum.photos/seed/deep/600/400" className="w-full h-full object-cover" alt="Deep Learning" />
          <div className="absolute inset-0 bg-gradient-to-t from-harven-dark/80 to-transparent flex items-end p-4">
            <Badge variant="default" className="bg-primary text-harven-dark border-none shadow-sm">
              EM ANDAMENTO
            </Badge>
          </div>
        </div>
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-bold text-harven-dark dark:text-white">Fundamentos de Deep Learning</h3>
            <p className="text-sm text-gray-500 mt-2">Continue de onde parou no Módulo 3: Redes Neurais Convolucionais. Você completou 75% deste capítulo.</p>
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-1.5">
                <span>Progresso do Capítulo</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <Button variant="outline" fullWidth>Ver Detalhes</Button>
            <Button variant="primary" fullWidth>Continuar</Button>
          </div>
        </div>
      </Card>

      {/* Recursos Recentes */}
      <Card>
        <div className="p-6 border-b border-harven-border flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-display font-bold text-harven-dark dark:text-white">Recursos Recentes</h3>
          <div className="w-full md:w-64">
            <Input
              icon="search"
              placeholder="Buscar..."
              className="py-1.5"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-harven-bg/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3">Nome do Arquivo</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Tamanho</th>
              <th className="px-6 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-harven-border">
            {[
              { name: 'Guia de Machine Learning.pdf', type: 'PDF', date: '12 Out, 2023', size: '2.4 MB', color: 'red' },
              { name: 'Anotações Aula 4.docx', type: 'DOC', date: '10 Out, 2023', size: '856 KB', color: 'blue' },
            ].map((file, i) => (
              <tr key={i} className="hover:bg-harven-bg/30 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-${file.color}-500 bg-${file.color}-50 p-2 rounded`}>description</span>
                    <span className="text-sm font-medium text-harven-dark dark:text-gray-200 group-hover:text-primary-dark transition-colors">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{file.type}</Badge>
                </td>
                <td className="px-6 py-4"><span className="text-sm text-gray-500">{file.date}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-500">{file.size}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-primary-dark transition-colors" title="Baixar Arquivo">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-harven-bg/30 text-center border-t border-harven-border">
          <button className="text-xs font-bold text-gray-500 hover:text-harven-dark uppercase tracking-widest hover:underline">Ver todos os arquivos</button>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
