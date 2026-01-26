import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { dashboardApi, disciplinesApi, coursesApi } from '../services/api';

interface StatItem {
  label: string;
  val: string;
  icon: string;
  trend: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardApi.getStats();
        setStats(statsData);

        // Buscar disciplinas do aluno
        const disciplinesData = await disciplinesApi.list();
        setDisciplines(disciplinesData);

        // Buscar cursos de cada disciplina
        const allCourses: any[] = [];
        for (const disc of disciplinesData.slice(0, 3)) { // Limitar a 3 disciplinas para performance
          try {
            const courses = await coursesApi.listByClass(disc.id);
            allCourses.push(...courses.map((c: any) => ({ ...c, disciplineName: disc.title })));
          } catch (e) {
            console.log(`Sem cursos para disciplina ${disc.id}`);
          }
        }
        setEnrolledCourses(allCourses);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
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

      {/* Meus Cursos */}
      <div>
        <h3 className="text-lg font-display font-bold text-harven-dark dark:text-white mb-4">Meus Cursos</h3>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">Carregando cursos...</p>
          </Card>
        ) : enrolledCourses.length === 0 ? (
          <Card className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">school</span>
            <p className="text-gray-500">Você ainda não está matriculado em nenhum curso.</p>
            <p className="text-sm text-gray-400 mt-1">Entre em contato com seu instrutor para ser adicionado a uma disciplina.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <Card
                key={course.id}
                hoverEffect
                className="cursor-pointer overflow-hidden"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="relative h-40">
                  <img
                    src={course.image || `https://picsum.photos/seed/${course.id}/600/400`}
                    className="w-full h-full object-cover"
                    alt={course.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-harven-dark/80 to-transparent flex items-end p-4">
                    <Badge variant="default" className="bg-primary text-harven-dark border-none shadow-sm">
                      {course.status || 'ATIVO'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {course.disciplineName || 'Disciplina'}
                  </p>
                  <h4 className="font-display font-bold text-harven-dark dark:text-white line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {course.description || 'Clique para ver o conteúdo do curso'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-harven-border flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {course.chapters_count || 0} módulos
                    </span>
                    <span className="material-symbols-outlined text-primary">arrow_forward</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Minhas Disciplinas */}
      {disciplines.length > 0 && (
        <div>
          <h3 className="text-lg font-display font-bold text-harven-dark dark:text-white mb-4">Minhas Disciplinas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {disciplines.map((disc) => (
              <Card key={disc.id} hoverEffect className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">school</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-harven-dark truncate">{disc.title || disc.name}</h4>
                    <p className="text-xs text-gray-400">{disc.department || 'Departamento'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

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
