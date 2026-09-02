import React from 'react';
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
import AuthView from './components/AuthView';

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
    <TicketProvider>
      <MainContent />
    </TicketProvider>
  );
}
