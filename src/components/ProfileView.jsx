import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building, 
  Lock, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Headphones, 
  Clock, 
  Calendar,
  Layers,
  KeyRound
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function ProfileView() {
  const { user, updateUserProfile, obras, chamados, setActiveTab } = useTickets();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [cargo, setCargo] = useState(user?.cargo || '');
  const [obraId, setObraId] = useState(user?.obraId || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  if (!user) return null;

  const isSupport = user.role === 'suporte';

  // User tickets calculation
  const userTickets = (chamados || []).filter(t => {
    if (!t) return false;
    if (t.solicitanteId && user?.id && t.solicitanteId === user.id) return true;
    if (t.solicitanteEmail && user?.email && t.solicitanteEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (t.solicitante && user?.nome && t.solicitante.toLowerCase().includes(user.nome.toLowerCase())) return true;
    return false;
  });

  const totalUserTickets = isSupport ? (chamados || []).length : userTickets.length;
  const pendingUserTickets = isSupport 
    ? (chamados || []).filter(c => c.status !== 'Concluído').length 
    : userTickets.filter(c => c.status !== 'Concluído').length;
  const doneUserTickets = isSupport 
    ? (chamados || []).filter(c => c.status === 'Concluído').length 
    : userTickets.filter(c => c.status === 'Concluído').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setFeedbackMsg({ type: 'error', text: 'As senhas informadas não coincidem.' });
      return;
    }

    const payload = {
      nome,
      email,
      telefone,
      cargo,
      obraId,
    };

    if (newPassword) {
      payload.password = newPassword;
    }

    updateUserProfile(payload);
    setFeedbackMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-page-enter max-w-4xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-full bg-[#66C1BF] text-[#08252B] font-mono font-black text-2xl flex items-center justify-center shadow-md shrink-0">
            {user.avatar || 'MA'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-[#F1F7F8]">{user.nome}</h2>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold border ${
                isSupport 
                  ? 'bg-[#66C1BF]/15 text-[#66C1BF] border-[#66C1BF]/30' 
                  : 'bg-[#E2B552]/15 text-[#E2B552] border-[#E2B552]/30'
              }`}>
                {isSupport ? 'Equipe de TI e Suporte' : 'Engenharia e Solicitante'}
              </span>
            </div>
            <p className="text-xs text-[#9EB5C1]">{user.cargo} • {user.obraNome}</p>
            <p className="text-xs text-[#7893A2]">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('chamados')}
          className="px-4 py-2 rounded-[8px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          Ver Meus Chamados
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#102A40] border border-[#234963] p-4 rounded-[10px] space-y-1">
          <span className="text-[11px] font-extrabold text-[#7893A2] uppercase tracking-wider block">
            {isSupport ? 'Total no Sistema' : 'Minhas Solicitações'}
          </span>
          <p className="text-2xl font-black text-[#F1F7F8]">{totalUserTickets}</p>
          <p className="text-xs text-[#66C1BF]">Chamados registrados</p>
        </div>

        <div className="bg-[#102A40] border border-[#234963] p-4 rounded-[10px] space-y-1">
          <span className="text-[11px] font-extrabold text-[#E2B552] uppercase tracking-wider block">
            Em Andamento
          </span>
          <p className="text-2xl font-black text-[#F1F7F8]">{pendingUserTickets}</p>
          <p className="text-xs text-[#9EB5C1]">Aguardando atendimento</p>
        </div>

        <div className="bg-[#102A40] border border-[#234963] p-4 rounded-[10px] space-y-1">
          <span className="text-[11px] font-extrabold text-[#43C486] uppercase tracking-wider block">
            Concluídos
          </span>
          <p className="text-2xl font-black text-[#F1F7F8]">{doneUserTickets}</p>
          <p className="text-xs text-[#43C486]">Resolvidos com sucesso</p>
        </div>
      </div>

      {/* Profile Edit Form Card */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#234963]">
          <div>
            <h3 className="text-base font-extrabold text-[#F1F7F8] flex items-center gap-2">
              <User className="w-5 h-5 text-[#66C1BF]" />
              <span>Dados Cadastrais do Perfil</span>
            </h3>
            <p className="text-xs text-[#9EB5C1]">
              Atualize suas informações de contato e credenciais corporativas.
            </p>
          </div>
        </div>

        {feedbackMsg && (
          <div className={`p-3 rounded-[8px] text-xs font-bold flex items-center gap-2 animate-page-enter ${
            feedbackMsg.type === 'success' 
              ? 'bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30' 
              : 'bg-[#E16666]/15 text-[#E16666] border border-[#E16666]/30'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#9EB5C1] font-bold block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Nome Completo</span>
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-[#9EB5C1] font-bold block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>E-mail Corporativo</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-[#9EB5C1] font-bold block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Telefone / WhatsApp</span>
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-[#9EB5C1] font-bold block mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Cargo / Função</span>
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex: Engenheiro Residente / Analista de TI"
                className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] font-bold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#9EB5C1] font-bold block mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Obra ou Unidade Padrão Vinculada</span>
              </label>
              <select
                value={obraId}
                onChange={(e) => setObraId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] font-bold outline-none"
              >
                {obras.map(o => (
                  <option key={o.id} value={o.id}>{o.nome} ({o.cidade})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="pt-4 border-t border-[#234963] space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-[#7893A2] tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#66C1BF]" />
              <span>Alteração de Senha (Opcional)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#9EB5C1] font-semibold block mb-1">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Deixe em branco para manter a atual"
                  className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none"
                />
              </div>

              <div>
                <label className="text-[#9EB5C1] font-semibold block mb-1">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-[#234963]">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações do Perfil</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
