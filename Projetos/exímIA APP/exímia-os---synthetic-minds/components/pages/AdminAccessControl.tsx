import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Mail,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Search,
  MessageSquare,
  AlertCircle,
  Shield
} from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';
import { supabase } from '../../src/lib/supabase/client';
import toast from 'react-hot-toast';

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  reviewed_by_name: string | null;
  rejection_reason: string | null;
}

interface AllowedEmail {
  email: string;
  created_at: string;
  notes: string | null;
  added_by_name: string | null;
  has_account: boolean;
}

interface AdminAccessControlProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminAccessControl: React.FC<AdminAccessControlProps> = ({
  onBack,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'whitelist'>('requests');
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailNotes, setNewEmailNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load data
  useEffect(() => {
    loadRequests();
    loadAllowedEmails();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('access_requests_dashboard')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading requests:', error);
      toast.error('Erro ao carregar solicitações');
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const loadAllowedEmails = async () => {
    const { data, error } = await supabase
      .from('allowed_emails_dashboard')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading allowed emails:', error);
      toast.error('Erro ao carregar emails autorizados');
    } else {
      setAllowedEmails(data || []);
    }
  };

  const approveRequest = async (requestId: string) => {
    setIsSubmitting(true);

    try {
      // Passo 1: Aprovar no banco (adiciona à whitelist)
      const { error: rpcError } = await supabase.rpc('approve_access_request', {
        request_id: requestId,
      });

      if (rpcError) {
        console.error('Error approving request:', rpcError);
        toast.error('Erro ao aprovar solicitação');
        setIsSubmitting(false);
        return;
      }

      // Passo 2: Chamar Edge Function diretamente (criar usuário + enviar email)
      // Usando fetch direto para evitar CORS do Supabase client
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/approve-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ requestId }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.warn('Edge Function error:', result);
        toast.success('✅ Solicitação aprovada! (Email pode ter falhado)');
      } else if (result.success) {
        if (result.userCreated) {
          toast.success('✅ Solicitação aprovada! Conta criada e email enviado.');
        } else {
          toast.success('✅ Solicitação aprovada! Usuário já existia.');
        }
      }

      await loadRequests();
      await loadAllowedEmails();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erro inesperado ao aprovar solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = (requestId: string) => {
    setRejectRequestId(requestId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const rejectRequest = async () => {
    if (!rejectRequestId) return;

    setIsSubmitting(true);
    const { error } = await supabase.rpc('reject_access_request', {
      request_id: rejectRequestId,
      reason: rejectionReason || null,
    });

    if (error) {
      console.error('Error rejecting request:', error);
      toast.error('Erro ao rejeitar solicitação');
    } else {
      toast.success('Solicitação rejeitada');
      await loadRequests();
      setShowRejectModal(false);
      setRejectRequestId(null);
      setRejectionReason('');
    }
    setIsSubmitting(false);
  };

  const addEmailManually = async () => {
    if (!newEmail) {
      toast.error('Email é obrigatório');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.rpc('add_allowed_email', {
      p_email: newEmail,
      p_notes: newEmailNotes || null,
    });

    if (error) {
      console.error('Error adding email:', error);
      if (error.code === '23505') {
        toast.error('Este email já está na whitelist');
      } else {
        toast.error('Erro ao adicionar email');
      }
    } else {
      toast.success('Email adicionado à whitelist');
      setShowAddModal(false);
      setNewEmail('');
      setNewEmailNotes('');
      await loadAllowedEmails();
    }
    setIsSubmitting(false);
  };

  const removeEmail = async (email: string) => {
    if (!confirm(`Tem certeza que deseja remover ${email} da whitelist?`)) {
      return;
    }

    const { error } = await supabase.rpc('remove_allowed_email', {
      p_email: email,
    });

    if (error) {
      console.error('Error removing email:', error);
      toast.error('Erro ao remover email');
    } else {
      toast.success('Email removido da whitelist');
      await loadAllowedEmails();
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const filteredRequests = requests.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.company && r.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredEmails = allowedEmails.filter((e) =>
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Controle de Acesso' },
        ]}
        onBack={onBack}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Shield}
          title="Controle de Acesso"
          description="Gerencie solicitações de acesso e whitelist de emails autorizados."
          showDefaultActions={false}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingRequests.length}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Pendentes</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {requests.filter((r) => r.status === 'approved').length}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Aprovadas</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{allowedEmails.length}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Autorizados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#1F1F22]">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'requests'
                ? 'text-amber-500'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Solicitações
            {pendingRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500/20 text-amber-500 rounded-full">
                {pendingRequests.length}
              </span>
            )}
            {activeTab === 'requests' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('whitelist')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'whitelist'
                ? 'text-amber-500'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Emails Autorizados
            {activeTab === 'whitelist' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
            />
          </div>
          {activeTab === 'whitelist' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Email
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Carregando...</div>
        ) : activeTab === 'requests' ? (
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Nenhuma solicitação encontrada</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-white">{request.name}</h3>
                        {request.status === 'pending' && (
                          <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-500 rounded-md uppercase tracking-wider">
                            Pendente
                          </span>
                        )}
                        {request.status === 'approved' && (
                          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-md uppercase tracking-wider">
                            Aprovada
                          </span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-500 rounded-md uppercase tracking-wider">
                            Rejeitada
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Mail className="w-4 h-4" />
                          {request.email}
                        </div>
                        {request.company && (
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Building2 className="w-4 h-4" />
                            {request.company}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Clock className="w-4 h-4" />
                          {new Date(request.created_at).toLocaleString('pt-BR')}
                        </div>
                      </div>

                      {request.message && (
                        <div className="bg-[#050505] border border-[#1F1F22] rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-zinc-500" />
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Mensagem</p>
                          </div>
                          <p className="text-sm text-zinc-300">{request.message}</p>
                        </div>
                      )}

                      {request.status === 'rejected' && request.rejection_reason && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <p className="text-xs text-red-500 uppercase tracking-wider">Motivo da Rejeição</p>
                          </div>
                          <p className="text-sm text-red-300">{request.rejection_reason}</p>
                        </div>
                      )}

                      {request.reviewed_at && (
                        <p className="text-xs text-zinc-600 mt-4">
                          {request.status === 'approved' ? 'Aprovada' : 'Rejeitada'} por {request.reviewed_by_name || 'Admin'} em{' '}
                          {new Date(request.reviewed_at).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => approveRequest(request.id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openRejectModal(request.id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmails.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Nenhum email autorizado encontrado</p>
              </div>
            ) : (
              filteredEmails.map((item) => (
                <div
                  key={item.email}
                  className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-amber-500" />
                      <h3 className="text-lg font-bold text-white">{item.email}</h3>
                      {item.has_account && (
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-500 rounded-md uppercase tracking-wider">
                          Conta Ativa
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-sm text-zinc-400 mb-2">{item.notes}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                      <span>
                        Adicionado por {item.added_by_name || 'Sistema'}
                      </span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEmail(item.email)}
                    className="px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Email Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0A0A0B] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Adicionar Email Manualmente
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={newEmailNotes}
                  onChange={(e) => setNewEmailNotes(e.target.value)}
                  rows={3}
                  placeholder="Ex: Aprovado via reunião executiva"
                  className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewEmail('');
                    setNewEmailNotes('');
                  }}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addEmailManually}
                  disabled={isSubmitting || !newEmail}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0A0A0B] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Rejeitar Solicitação
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Motivo da Rejeição (opcional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Ex: Não atende aos critérios de acesso à plataforma"
                  className="w-full px-4 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectRequestId(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={rejectRequest}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Rejeitando...' : 'Rejeitar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccessControl;
