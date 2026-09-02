import React, { Component } from 'react';
import { TicketProvider, useTickets } from './context/TicketContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import DashboardView from './components/DashboardView';
import ClientDashboardView from './components/ClientDashboardView';
import TicketsView from './components/TicketsView';
import TicketDetailModal from './components/TicketDetailModal';
import NewTicketModal from './components/NewTicketModal';
import ObrasView from './components/ObrasView';
import CategoriasView from './components/CategoriasView';
import RelatoriosView from './components/RelatoriosView';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';
import { RefreshCw, AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1D2D] text-[#F1F7F8] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#102A40] border border-[#234963] p-8 rounded-[14px] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E16666]/15 border border-[#E16666]/30 text-[#E16666] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-[#F1F7F8]">Ocorreu um imprevisto na renderização</h2>
            <p className="text-xs text-[#9EB5C1]">
              Clique no botão abaixo para restaurar o estado da aplicação e reiniciar com segurança.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restaurar e Recarregar</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainContent() {
  const { activeTab, currentUser } = useTickets();

  // If not logged in, show authentication screen
  if (!currentUser) {
    return <AuthView />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser.role === 'cliente' ? <ClientDashboardView /> : <DashboardView />;
      case 'chamados':
        return <TicketsView />;
      case 'obras':
        return <ObrasView />;
      case 'categorias':
        return <CategoriasView />;
      case 'relatorios':
        return <RelatoriosView />;
      case 'perfil':
        return <ProfileView />;
      default:
        return currentUser.role === 'cliente' ? <ClientDashboardView /> : <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1D2D] text-[#F1F7F8] antialiased selection:bg-[#66C1BF]/30 selection:text-[#66C1BF]">
      {/* Sticky Header with User info & logout */}
      <Header />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative items-start">
        {/* Desktop Sidebar (customized for Cliente vs Suporte) */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden animate-page-enter">
          {renderTab()}
        </main>
      </div>

      {/* Mobile Fixed Navigation Bar */}
      <MobileNav />

      {/* Modals */}
      <TicketDetailModal />
      <NewTicketModal />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TicketProvider>
        <MainContent />
      </TicketProvider>
    </ErrorBoundary>
  );
}
