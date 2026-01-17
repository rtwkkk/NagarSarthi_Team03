import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { DarkModeProvider } from './contexts/dark-mode-context';
import { LanguageProvider } from './contexts/language-context';
import { AuthPage } from './components/auth-page';
import { DashboardHeader } from './components/dashboard-header';
import { DashboardFooter } from './components/dashboard-footer';
import { Sidebar } from './components/sidebar';
import { DashboardView } from './components/dashboard-view';
import { ReportsView } from './components/reports-view';
import { AnalyticsView } from './components/analytics-view';
import { SettingsView } from './components/settings-view';
import { IncidentsDashboard } from './components/incidents-dashboard';
import { AllIncidentsDetails } from './components/all-incidents-details';
import { SearchResultsView } from './components/search-results-view';
import { AdminActionsSidebar } from './components/admin-actions-sidebar';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveSection} />;
      case 'incidents':
        return <IncidentsDashboard />;
      case 'reports':
        return <ReportsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'search':
        return <SearchResultsView searchQuery={searchQuery} onClearSearch={() => {
          setSearchQuery('');
          setActiveSection('dashboard');
        }} />;
      default:
        return <DashboardView />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Welcome to Nagar Sarthi';
      case 'incidents':
        return 'Incidents Management';
      case 'reports':
        return 'Reports & Documentation';
      case 'analytics':
        return 'Advanced Analytics';
      case 'settings':
        return 'Settings & Configuration';
      case 'search':
        return 'Search Results';
      default:
        return 'Dashboard';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Real-time monitoring & AI-powered analytics';
      case 'incidents':
        return 'Track and manage customer-reported incidents in real-time';
      case 'reports':
        return 'Comprehensive incident reports and documentation';
      case 'analytics':
        return 'Deep insights and performance analysis';
      case 'settings':
        return 'Manage your preferences and system configuration';
      case 'search':
        return `Showing results for "${searchQuery}"`;
      default:
        return 'Dashboard';
    }
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => { }} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* All Incidents Details Route */}
        <Route path="/incidents/all" element={<AllIncidentsDetails />} />

        {/* Incidents Dashboard Route with Filter */}
        <Route
          path="/incidents"
          element={
            <MainDashboard
              activeSection="incidents"
              setActiveSection={setActiveSection}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              getSectionTitle={getSectionTitle}
              getSectionDescription={getSectionDescription}
              renderContent={renderContent}
              onSearch={(query: string) => {
                setSearchQuery(query);
                if (query.trim()) {
                  setActiveSection('search');
                } else {
                  setActiveSection('dashboard');
                }
              }}
            />
          }
        />

        {/* Main Dashboard Route */}
        <Route
          path="/*"
          element={
            <MainDashboard
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              getSectionTitle={getSectionTitle}
              getSectionDescription={getSectionDescription}
              renderContent={renderContent}
              onSearch={(query: string) => {
                setSearchQuery(query);
                if (query.trim()) {
                  setActiveSection('search');
                } else {
                  setActiveSection('dashboard');
                }
              }}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function MainDashboard({ activeSection, setActiveSection, isSidebarCollapsed, setIsSidebarCollapsed, getSectionTitle, getSectionDescription, renderContent, onSearch }: any) {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 overflow-hidden scrollbar-hide">
      {/* Fixed Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onCollapsedChange={setIsSidebarCollapsed}
      />

      {/* Main Content Area with dynamic margin for sidebar */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
      >
        {/* Header */}
        <DashboardHeader
          onNavigateToSettings={setActiveSection}
          onSearch={onSearch}
        />

        {/* Right Action Sidebar */}
        <AdminActionsSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 pr-12 space-y-6 overflow-y-auto scrollbar-hide">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-4 shadow-xl dark:bg-gradient-to-r dark:from-blue-950 dark:via-blue-900 dark:to-cyan-950 dark:border-2 dark:border-blue-700/50 dark:shadow-2xl dark:shadow-blue-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center dark:bg-blue-500/30 dark:border dark:border-blue-400/30">
                  <Sparkles className="w-6 h-6 text-white animate-pulse dark:text-blue-200" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-0.5">{getSectionTitle()}</h2>
                  <p className="text-blue-100 text-xs dark:text-blue-300">{getSectionDescription()}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </DarkModeProvider>
    </AuthProvider>
  );
}