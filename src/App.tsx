import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar';
import { UsernameModal } from '@/components/UsernameModal';
import { HomePage } from '@/pages/HomePage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { EditorPage } from '@/pages/EditorPage';
import { AdminPage } from '@/pages/AdminPage';
import { DeployedSitePage } from '@/pages/DeployedSitePage';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import { api } from '@/lib/api';

function AppContent() {
  const { isLoading, user, isAdmin, setSiteSettings } = useStore();

  useEffect(() => {
    api.settings.get().then((settings) => {
      setSiteSettings(settings);
      if (settings.siteTitle) {
        document.title = settings.siteTitle;
      }
    }).catch(() => {});
  }, [setSiteSettings]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f8fafc]">
      <Navbar />
      {!user && <UsernameModal />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/editor/:templateId" element={<EditorPage />} />
        <Route path="/admin" element={isAdmin ? <AdminPage /> : <AdminPage />} />
        <Route path="/sites/:username/:siteId" element={<DeployedSitePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
