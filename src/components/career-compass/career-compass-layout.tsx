'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '@/contexts/app-context';
import Header from './header';
import Sidebar from './sidebar';
import MobileSidebar from './mobile-sidebar';
import LoginDialog from './login-dialog';
import GatePlaceholder from './gate-placeholder';
import TwinklingStars from './twinkling-stars';
import Footer from './footer';
import ProfilePage from './profile-page';
import SettingsPage from './settings-page';
import CommunityPage from './community-page';
import ChatPage from './chat-page';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

// Infralith Construction Intelligence Modules
import DashboardHome from '@/components/infralith/DashboardHome';
import BlueprintUpload from '@/components/infralith/BlueprintUpload';
import PipelineStatus from '@/components/infralith/PipelineStatus';
import ComplianceView from '@/components/infralith/ComplianceView';
import RiskView from '@/components/infralith/RiskView';
import CostPrediction from '@/components/infralith/CostPrediction';
import DecisionPanel from '@/components/infralith/DecisionPanel';
import ReportView from '@/components/infralith/ReportView';

function AISearchPlaceholder() {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="flex justify-center">
        <div className="p-4 bg-primary/10 rounded-full">
          <Search className="h-12 w-12 text-primary animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold">Azure AI Search Index</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Querying structural data via semantic search. All blueprint data is indexed and searchable across projects.
      </p>
    </div>
  );
}

export default function CareerCompassLayout() {
  const { activeRoute, authed, showLogin } = useAppContext();
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(true);

  const gated = (component: React.ReactNode) =>
    authed ? component : <GatePlaceholder />;

  const componentMap: { [key: string]: React.ReactNode } = {
    home: <DashboardHome />,
    upload: gated(<BlueprintUpload />),
    pipeline: gated(<PipelineStatus />),
    compliance: gated(<ComplianceView />),
    risk: gated(<RiskView />),
    cost: gated(<CostPrediction />),
    decision: gated(<DecisionPanel />),
    report: gated(<ReportView />),
    search: gated(<AISearchPlaceholder />),
    community: gated(<CommunityPage />),
    chat: gated(<ChatPage />),
    profile: gated(<ProfilePage />),
    settings: gated(<SettingsPage />),
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <>
      <TwinklingStars />
      <div className="h-screen w-full text-foreground font-body relative flex flex-col">
        <Header
          desktopSidebarCollapsed={desktopSidebarCollapsed}
          onToggleDesktopSidebar={() => setDesktopSidebarCollapsed((c) => !c)}
        />

        <div className="flex h-[calc(100vh-69px)]">
          {authed && (
            <>
              <Sidebar collapsed={desktopSidebarCollapsed} />
              <MobileSidebar />
            </>
          )}

          <main className={cn('flex-1 relative', 'p-4 md:p-6 space-y-6 overflow-y-auto')}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoute}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {componentMap[activeRoute] ?? <DashboardHome />}
              </motion.div>
            </AnimatePresence>
            {activeRoute === 'home' && <Footer />}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showLogin && <LoginDialog />}
      </AnimatePresence>
    </>
  );
}