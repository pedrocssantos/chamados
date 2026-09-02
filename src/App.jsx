import React from 'react';
import { TicketProvider, useTickets } from './context/TicketContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import DashboardView from './components/DashboardView';
import TicketsView from './components/TicketsView';
import TicketDetailModal from './components/TicketDetailModal';
import NewTicketModal from './components/NewTicketModal';
import ObrasView from './components/ObrasView';
import CategoriasView from './components/CategoriasView';
import RelatoriosView from './components/RelatoriosView';

function MainContent() {
  const { activeTab } = useTickets();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'chamados':
        return <TicketsView />;
      case 'obras':
        return <ObrasView />;
      case 'categorias':
        return <CategoriasView />;
      case 'relatorios':
        return <RelatoriosView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1D2D] text-[#F1F7F8] antialiased selection:bg-[#66C1BF]/30 selection:text-[#66C1BF]">
      {/* Sticky Header */}
      <Header />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative items-start">
        {/* Desktop Sidebar */}
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
