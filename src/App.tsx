import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Landing from '@/pages/Landing';
import PageLoader from '@/components/ui/PageLoader';

const RolePage = lazy(() => import('@/pages/RolePage'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Pages are lazy-loaded, so the target may not exist yet: retry briefly.
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) {
        window.clearInterval(timer);
        el?.scrollIntoView();
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/data-analyst" element={<RolePage role="data" />} />
          <Route path="/ai-ml-engineer" element={<RolePage role="ai" />} />
          <Route path="/hybrid" element={<RolePage role="hybrid" />} />
          <Route path="/data-analyst/projects/:projectId" element={<ProjectPage role="data" />} />
          <Route path="/ai-ml-engineer/projects/:projectId" element={<ProjectPage role="ai" />} />
          <Route path="/hybrid/projects/:projectId" element={<ProjectPage role="hybrid" />} />
          <Route path="/privacy" element={<LegalPage doc="privacy" />} />
          <Route path="/terms" element={<LegalPage doc="terms" />} />
          <Route path="/disclaimer" element={<LegalPage doc="disclaimer" />} />
          {/* Legacy paths from earlier versions */}
          <Route path="/aiml" element={<Navigate to="/ai-ml-engineer" replace />} />
          <Route path="/ai-ml" element={<Navigate to="/ai-ml-engineer" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
