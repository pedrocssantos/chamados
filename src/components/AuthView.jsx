import React, { useState } from 'react';
import { 
  MonitorCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building, 
  Briefcase, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Headphones,
  HardHat
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function AuthView() {
  const { login, registerUser, obras, theme, toggleTheme } = useTickets();

  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'lostpass'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('pedro.santos@maximoaldana.com.br');
  const [loginPassword, setLoginPassword] = useState('bXwxAUL5@pedro24');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCargo, setRegCargo] = useState('Engenheiro Residente');
  const [regObraId, setRegObraId] = useState(obras[0]?.id || 'loc-1');
  const [regRole, setRegRole] = useState('cliente'); // 'cliente' | 'suporte'
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMessage(res.message || 'Credenciais inválidas.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('As senhas não coincidem. Digite novamente.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const obraObj = obras.find(o => o.id === regObraId) || obras[0];

    const res = registerUser({
      nome: regName,
      email: regEmail,
      telefone: regPhone,
      cargo: regCargo,
      obraId: regObraId,
      obraNome: obraObj.nome,
      role: regRole,
      password: regPassword,
    });

    if (res.success) {
      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
    } else {
      setErrorMessage(res.message || 'Erro ao registrar usuário.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1D2D] text-[#F1F7F8] flex flex-col justify-between selection:bg-[#66C1BF]/30 selection:text-[#66C1BF] relative overflow-hidden">
      
      {/* Top Brand Bar */}
      <header className="w-full bg-[#102A40]/80 backdrop-blur-md border-b border-[#234963] px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#66C1BF] text-[#08252B] font-extrabold text-sm tracking-[0.06em] px-3 py-1.5 rounded-[6px] shadow-[0_2px_8px_rgba(102,193,191,0.25)] flex items-center gap-1.5">
            <MonitorCheck className="w-4 h-4 text-[#08252B]" />
            <span>MAXIMO ALDANA TI</span>
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-[#9EB5C1]">
            Sistema Integrado de Suporte e Chamados de Obras
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="text-xs font-bold text-[#66C1BF] hover:text-[#F1F7F8] px-3 py-1.5 rounded-[6px] border border-[#234963] hover:border-[#66C1BF] transition-all"
        >
          {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="bg-[#102A40] border border-[#66C1BF]/35 rounded-[16px] max-w-[480px] w-full shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-page-enter">
          
          {/* Card Header & Tabs */}
          <div className="bg-[#081724] px-6 pt-6 pb-4 border-b border-[#234963]">
            <div className="text-center space-y-1 mb-5">
              <h2 className="text-xl font-extrabold text-[#F1F7F8] tracking-tight">
                {tab === 'login' ? 'Acesso ao Sistema de Chamados' : tab === 'register' ? 'Criar Cadastro de Usuário' : 'Recuperar Acesso'}
              </h2>
              <p className="text-xs text-[#9EB5C1]">
                {tab === 'login' 
                  ? 'Informe suas credenciais corporativas para entrar.' 
                  : tab === 'register' 
                  ? 'Vincule seu cadastro à sua obra ou setor de TI.' 
                  : 'Enviaremos instruções de redefinição de senha.'}
              </p>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex bg-[#14334C] p-1 rounded-[8px] border border-[#234963]">
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 rounded-[6px] text-xs font-bold transition-all text-center ${
                  tab === 'login'
                    ? 'bg-[#66C1BF] text-[#08252B] shadow-sm'
                    : 'text-[#9EB5C1] hover:text-[#F1F7F8]'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 rounded-[6px] text-xs font-bold transition-all text-center ${
                  tab === 'register'
                    ? 'bg-[#66C1BF] text-[#08252B] shadow-sm'
                    : 'text-[#9EB5C1] hover:text-[#F1F7F8]'
                }`}
              >
                Criar Conta
              </button>
            </div>
          </div>

          {/* Messages Alert Box */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-[8px] bg-[#E16666]/15 border border-[#E16666]/40 text-[#E16666] text-xs font-semibold flex items-center gap-2 animate-page-enter">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-4 p-3 rounded-[8px] bg-[#43C486]/15 border border-[#43C486]/40 text-[#43C486] text-xs font-semibold flex items-center gap-2 animate-page-enter">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#66C1BF]" /> E-mail Corporativo
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="pedro.santos@maximoaldana.com.br"
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#66C1BF]" /> Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7893A2] hover:text-[#66C1BF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Quick fill credentials */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#9EB5C1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#081724] border-[#234963] text-[#66C1BF] focus:ring-0 cursor-pointer"
                  />
                  <span>Lembrar meu acesso</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('roberto.farias@maximoaldana.com.br');
                    setLoginPassword('senha123');
                  }}
                  className="text-[#66C1BF] hover:underline font-semibold text-[11px]"
                >
                  Entrar como Cliente/Obra
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs shadow-[0_4px_14px_rgba(102,193,191,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-[#234963] text-center">
                <p className="text-[11px] text-[#7893A2]">
                  Dúvidas com seu acesso? Contate a equipe de TI em <strong className="text-[#9EB5C1]">ti@maximoaldana.com.br</strong>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[65vh] overflow-y-auto">
              
              {/* Profile Type Selector: Cliente vs Suporte */}
              <div className="space-y-1.5 pb-2 border-b border-[#234963]">
                <label className="text-xs text-[#9EB5C1] font-semibold block">Tipo de Perfil de Acesso *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('cliente')}
                    className={`p-2.5 rounded-[8px] border text-left flex items-center gap-2.5 transition-all ${
                      regRole === 'cliente'
                        ? 'bg-[#66C1BF]/15 border-[#66C1BF] text-[#66C1BF]'
                        : 'bg-[#081724] border-[#234963] text-[#9EB5C1] hover:border-[#66C1BF]/50'
                    }`}
                  >
                    <HardHat className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Cliente / Obra</p>
                      <p className="text-[10px] opacity-75 mt-0.5">Abre chamados do canteiro</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('suporte')}
                    className={`p-2.5 rounded-[8px] border text-left flex items-center gap-2.5 transition-all ${
                      regRole === 'suporte'
                        ? 'bg-[#66C1BF]/15 border-[#66C1BF] text-[#66C1BF]'
                        : 'bg-[#081724] border-[#234963] text-[#9EB5C1] hover:border-[#66C1BF]/50'
                    }`}
                  >
                    <Headphones className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Suporte / TI</p>
                      <p className="text-[10px] opacity-75 mt-0.5">Atende e resolve chamados</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#66C1BF]" /> Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Eng. Roberto Farias"
                  className="w-full px-3.5 py-2 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
                />
              </div>

              {/* Corporate Email */}
              <div className="space-y-1">
                <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#66C1BF]" /> E-mail Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="roberto.farias@maximoaldana.com.br"
                  className="w-full px-3.5 py-2 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
                />
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#66C1BF]" /> Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#66C1BF]" /> Cargo / Função *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCargo}
                    onChange={(e) => setRegCargo(e.target.value)}
                    placeholder="Ex: Engenheiro Residente"
                    className="w-full px-3.5 py-2 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Obra Binding */}
              <div className="space-y-1">
                <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#66C1BF]" /> Vínculo com Obra / Local Principal *
                </label>
                <select
                  value={regObraId}
                  onChange={(e) => setRegObraId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] font-semibold focus:outline-none"
                >
                  {obras.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.nome} ({o.cidade})
                    </option>
                  ))}
                </select>
                <p className="text-[10.5px] text-[#7893A2]">
                  Seus novos chamados serão vinculados automaticamente a esta obra.
                </p>
              </div>

              {/* Password & Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#66C1BF]" /> Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 dígitos"
                    className="w-full px-3.5 py-2 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#66C1BF]" /> Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full px-3.5 py-2 rounded-[8px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs shadow-[0_4px_14px_rgba(102,193,191,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir Cadastro</span>
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-4 text-center text-xs text-[#7893A2] border-t border-[#234963]/60 z-10">
        <p>© 2026 Construtora e Incorporadora Maximo Aldana. Todos os direitos reservados.</p>
        <p className="text-[10px] text-[#5E7A8A] mt-0.5">Segurança & Autenticação Integrada</p>
      </footer>
    </div>
  );
}
