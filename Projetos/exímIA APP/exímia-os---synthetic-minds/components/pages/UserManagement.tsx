import React, { useState } from 'react';
import { TEAM_MEMBERS, MOCK_DIRECTIVES, APP_MODULES } from '../../constants';
import { TeamMember, UserDirective } from '../../types';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { SearchBar } from '../molecules/SearchBar';
import { 
  User, 
  Mail, 
  MoreVertical, 
  Plus, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Briefcase,
  TrendingUp,
  Shield,
  Send,
  Lock,
  ChevronDown
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(TEAM_MEMBERS[0].id);
  const [directives, setDirectives] = useState<UserDirective[]>(MOCK_DIRECTIVES);
  const [newDirective, setNewDirective] = useState('');
  const [directiveType, setDirectiveType] = useState<UserDirective['type']>('feedback');
  const [filterRole, setFilterRole] = useState('All');
  const [activeTab, setActiveTab] = useState<'directives' | 'access'>('directives');

  // Local state for permissions (mocking DB update)
  const [users, setUsers] = useState<TeamMember[]>(TEAM_MEMBERS);

  const selectedUser = users.find(u => u.id === selectedUserId);
  const userDirectives = directives.filter(d => d.userId === selectedUserId);

  const filteredUsers = filterRole === 'All' 
    ? users 
    : users.filter(u => u.department === filterRole);

  const handleAddDirective = () => {
    if (!newDirective.trim() || !selectedUserId) return;

    const newItem: UserDirective = {
      id: Math.random().toString(36).substr(2, 9),
      userId: selectedUserId,
      type: directiveType,
      content: newDirective,
      priority: 'medium',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin', // Mocked
      status: 'active'
    };

    setDirectives([newItem, ...directives]);
    setNewDirective('');
  };

  const handleTogglePermission = (moduleId: string) => {
      if (!selectedUser) return;
      const hasPermission = selectedUser.permissions.includes(moduleId);
      let newPermissions = [...selectedUser.permissions];
      
      if (hasPermission) {
          newPermissions = newPermissions.filter(p => p !== moduleId);
      } else {
          newPermissions.push(moduleId);
      }

      const updatedUsers = users.map(u => u.id === selectedUser.id ? { ...u, permissions: newPermissions } : u);
      setUsers(updatedUsers);
  };

  const handleAccountTypeChange = (type: TeamMember['accountType']) => {
      if (!selectedUser) return;
      const updatedUsers = users.map(u => u.id === selectedUser.id ? { ...u, accountType: type } : u);
      setUsers(updatedUsers);
  }

  const getDirectiveIcon = (type: string) => {
      switch(type) {
          case 'feedback': return <MessageSquare className="w-4 h-4 text-purple-500" />;
          case 'task': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
          case 'alignment': return <Shield className="w-4 h-4 text-blue-500" />;
          default: return <Clock className="w-4 h-4 text-zinc-500" />;
      }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-[1800px] mx-auto p-6 animate-fade-in font-sans overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                Gestão de Talentos
                <span className="text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">{users.length} Membros</span>
            </h1>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Adicionar Usuário</Button>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
          
          {/* LEFT: User List */}
          <div className="w-1/3 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
                  <SearchBar />
                  <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                      {['All', 'Product', 'Engineering', 'Marketing'].map(role => (
                          <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${filterRole === role ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                          >
                              {role}
                          </button>
                      ))}
                  </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                  {filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`flex items-center gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${selectedUserId === user.id ? 'bg-zinc-50 dark:bg-zinc-800/80 border-l-4 border-l-eximia-500' : 'border-l-4 border-l-transparent'}`}
                      >
                          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-500 dark:text-zinc-300 shrink-0">
                              {user.avatarInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h4 className={`text-sm font-bold truncate ${selectedUserId === user.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>{user.name}</h4>
                                {user.accountType === 'Admin' && <Badge variant="primary" className="scale-75 origin-right">Admin</Badge>}
                              </div>
                              <p className="text-xs text-zinc-500 truncate">{user.role}</p>
                          </div>
                          <div className="text-right">
                              <span className={`inline-block w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-emerald-500' : user.status === 'Focus' ? 'bg-purple-500' : 'bg-zinc-400'}`}></span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* RIGHT: Detail View */}
          <div className="flex-1 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden">
              {selectedUser ? (
                  <>
                    {/* User Header */}
                    <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-500 dark:text-zinc-300 shadow-inner">
                                    {selectedUser.avatarInitials}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{selectedUser.name}</h2>
                                    <p className="text-zinc-500 text-sm font-medium mb-3">{selectedUser.role} • {selectedUser.department}</p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="gap-1 pl-1"><Mail className="w-3 h-3" /> Email</Badge>
                                        <Badge variant="outline" className="gap-1 pl-1"><Briefcase className="w-3 h-3" /> Projects: {selectedUser.projects}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm mb-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{selectedUser.performance}% Performance</span>
                                </div>
                                <p className="text-xs text-zinc-400">Última avaliação: 2 dias atrás</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-8">
                        <button 
                            onClick={() => setActiveTab('directives')}
                            className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'directives' ? 'border-eximia-500 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            <MessageSquare className="w-4 h-4" /> Diretrizes & Feedback
                        </button>
                        <button 
                            onClick={() => setActiveTab('access')}
                            className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'access' ? 'border-eximia-500 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            <Lock className="w-4 h-4" /> Acesso & Configurações
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-[#09090B]/50">
                        
                        {/* --- DIRECTIVES TAB --- */}
                        {activeTab === 'directives' && (
                            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-eximia-500" />
                                    Inputs & Diretrizes
                                </h3>
                                
                                <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm mb-8">
                                    <textarea 
                                        value={newDirective}
                                        onChange={(e) => setNewDirective(e.target.value)}
                                        placeholder={`Adicionar feedback ou diretriz para ${selectedUser.name.split(' ')[0]}...`}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-eximia-400 min-h-[80px] resize-none mb-3"
                                    />
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button onClick={() => setDirectiveType('feedback')} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${directiveType === 'feedback' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>Feedback</button>
                                            <button onClick={() => setDirectiveType('task')} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${directiveType === 'task' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>Tarefa</button>
                                            <button onClick={() => setDirectiveType('alignment')} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${directiveType === 'alignment' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>Alinhamento</button>
                                        </div>
                                        <Button size="sm" onClick={handleAddDirective} icon={<Send className="w-3 h-3" />}>Enviar</Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {userDirectives.length === 0 ? (
                                        <div className="text-center py-10 text-zinc-400">Nenhuma diretriz ativa para este usuário.</div>
                                    ) : (
                                        userDirectives.map(directive => (
                                            <div key={directive.id} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex gap-4">
                                                <div className={`mt-1 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 shrink-0 h-fit`}>
                                                    {getDirectiveIcon(directive.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{directive.type}</span>
                                                        <span className="text-xs text-zinc-400">{directive.createdAt}</span>
                                                    </div>
                                                    <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed mb-3">{directive.content}</p>
                                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                                                        <span className="text-xs text-zinc-500">Por: <span className="font-medium text-zinc-700 dark:text-zinc-300">{directive.createdBy}</span></span>
                                                        <div className="flex gap-2">
                                                            <button className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-medium">Editar</button>
                                                            <button className="text-xs text-rose-400 hover:text-rose-600 font-medium">Arquivar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- ACCESS TAB --- */}
                        {activeTab === 'access' && (
                            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                                
                                {/* Account Type Card */}
                                <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tipo de Conta</h3>
                                            <p className="text-xs text-zinc-500 mt-1">Define o nível de privilégio administrativo.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div 
                                            onClick={() => handleAccountTypeChange('Admin')}
                                            className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${selectedUser.accountType === 'Admin' ? 'border-eximia-500 bg-eximia-50 dark:bg-eximia-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-bold ${selectedUser.accountType === 'Admin' ? 'text-eximia-700 dark:text-eximia-400' : 'text-zinc-700 dark:text-zinc-300'}`}>Admin</span>
                                                {selectedUser.accountType === 'Admin' && <CheckCircle2 className="w-4 h-4 text-eximia-500" />}
                                            </div>
                                            <p className="text-xs text-zinc-500">Acesso total para editar, convidar e configurar o workspace.</p>
                                        </div>
                                        <div 
                                            onClick={() => handleAccountTypeChange('Member')}
                                            className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${selectedUser.accountType === 'Member' ? 'border-eximia-500 bg-eximia-50 dark:bg-eximia-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-bold ${selectedUser.accountType === 'Member' ? 'text-eximia-700 dark:text-eximia-400' : 'text-zinc-700 dark:text-zinc-300'}`}>Membro</span>
                                                {selectedUser.accountType === 'Member' && <CheckCircle2 className="w-4 h-4 text-eximia-500" />}
                                            </div>
                                            <p className="text-xs text-zinc-500">Acesso restrito aos módulos permitidos abaixo.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Permissions List */}
                                <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Permissões de Módulo</h3>
                                        <p className="text-xs text-zinc-500 mt-1">Controle quais áreas do sistema este usuário pode visualizar.</p>
                                    </div>
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {APP_MODULES.map(module => {
                                            const isAllowed = selectedUser.permissions.includes(module.id);
                                            return (
                                                <div key={module.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors">
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{module.label}</p>
                                                        <p className="text-xs text-zinc-500 mt-0.5">{module.description}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleTogglePermission(module.id)}
                                                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black ${isAllowed ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                                    >
                                                        <span className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-1 ml-1 ${isAllowed ? 'translate-x-5' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                  </>
              ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-400">
                      Selecione um usuário para gerenciar.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};