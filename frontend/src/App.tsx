import { ConfigProvider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { vehicles } from './data/vehicles';
import { SiteHeader } from './components/SiteHeader';
import { InventoryPage } from './pages/InventoryPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { ConditionReportPage } from './pages/ConditionReportPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import HowItWorksSeller from './pages/HowItWorksSeller';
import SubmitVehicle from './pages/SubmitsVehicle';
import { ProtectedRoute } from './Protectedroute';
import { AuthProvider, useAuth } from './Authontext';

type Page =
  | 'home'
  | 'inventory'
  | 'details'
  | 'report'
  | 'contact'
  | 'howItWorks'
  | 'howItWorksSeller'
  | 'submitVehicle'
  | 'login'
  | 'dashboard';

const pagePaths: Record<Exclude<Page, 'details' | 'report'>, string> = {
  home: '/home',
  inventory: '/inventory',
  contact: '/contact',
  howItWorks: '/how-it-works',
  howItWorksSeller: '/how-it-works-seller',
  submitVehicle: '/submit-vehicle',
  login: '/login',
  dashboard: '/dashboard',
};

const getRouteState = (pathname: string) => {
  const [, firstSegment, secondSegment, thirdSegment] = pathname.split('/');

  if (!firstSegment) {
    return { page: 'home' as Page, vehicleId: vehicles[0].id, shouldReplace: true };
  }

  if (firstSegment === 'vehicle' && secondSegment) {
    const vehicleId = vehicles.some((v) => v.id === secondSegment) ? secondSegment : vehicles[0].id;
    return {
      page: thirdSegment === 'report' ? ('report' as Page) : ('details' as Page),
      vehicleId,
    };
  }

  const pathPage = (
    Object.entries(pagePaths).find(([, path]) => path === `/${firstSegment}`)?.[0] ?? 'home'
  ) as Page;

  return {
    page: pathPage,
    vehicleId: vehicles[0].id,
    shouldReplace: !Object.values(pagePaths).includes(`/${firstSegment}`),
  };
};

const getPagePath = (page: Page, vehicleId: string) => {
  if (page === 'details') return `/vehicle/${vehicleId}`;
  if (page === 'report') return `/vehicle/${vehicleId}/report`;
  return pagePaths[page];
};

// ---------------------------------------------------------------------------
// Inner component — needs to be inside AuthProvider to call useAuth()
// ---------------------------------------------------------------------------
function AppInner() {
  const { user, logout } = useAuth();

  const initialRoute = getRouteState(window.location.pathname);
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialRoute.vehicleId);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId) ?? vehicles[0],
    [selectedVehicleId],
  );

  useEffect(() => {
    if (initialRoute.shouldReplace) {
      window.history.replaceState(null, '', getPagePath(initialRoute.page, initialRoute.vehicleId));
    }

    const handlePopState = () => {
      const nextRoute = getRouteState(window.location.pathname);
      setPage(nextRoute.page);
      setSelectedVehicleId(nextRoute.vehicleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = (nextPage: Page, vehicleId = selectedVehicleId) => {
    const nextPath = getPagePath(nextPage, vehicleId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    setPage(nextPage);
    setSelectedVehicleId(vehicleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openVehicleDetails = (vehicleId: string) => navigateTo('details', vehicleId);
  const openPage = (nextPage: Page) => navigateTo(nextPage);

  const handleLogout = () => {
    logout();
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-lane-ink font-sans text-white">
      {page !== 'dashboard' && (
          <SiteHeader
            onHomeClick={() => openPage('home')}
            onVehicleClick={() => openPage('submitVehicle')}
            onInventoryClick={() => openPage('inventory')}
          onContactClick={() => openPage('contact')}
          onHowItWorksClick={() => openPage('howItWorks')}
          onHowItWorksSellerClick={() => openPage('howItWorksSeller')}
          onLoginClick={() => openPage('login')}
          onLogoutClick={handleLogout}
          onDashboardClick={() => openPage('dashboard')}
          showDealerLogin={page === 'home'}
          showLogo={page !== 'home'}
          activePage={page}
        />
      )}

      {/* ── Public pages ────────────────────────────────────────────── */}
      {page === 'home' && (
        <Home
          onSellVehicleClick={() => openPage('submitVehicle')}
          onContactClick={() => openPage('contact')}
        />
      )}
      {page === 'login' && (
        <LoginPage
          onDealerLogin={() => navigateTo('inventory')}
          onAdminLogin={() => navigateTo('dashboard')}
        />
      )}
      {page === 'contact' && <ContactPage />}
      {page === 'howItWorks' && <HowItWorks />}
      {page === 'howItWorksSeller' && <HowItWorksSeller />}
      {page === 'submitVehicle' && <SubmitVehicle />}

      {/* ── Dealer-only pages ────────────────────────────────────────── */}
      {page === 'inventory' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          <InventoryPage vehicles={vehicles} onVehicleSelect={openVehicleDetails} />
        </ProtectedRoute>
      )}
      {page === 'details' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          <CarDetailsPage
            vehicle={selectedVehicle}
            onViewReport={() => navigateTo('report', selectedVehicle.id)}
          />
        </ProtectedRoute>
      )}
      {page === 'report' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          <ConditionReportPage vehicle={selectedVehicle} />
        </ProtectedRoute>
      )}

      {/* ── Admin-only pages ─────────────────────────────────────────── */}
      {page === 'dashboard' && (
        <ProtectedRoute allowedRole={['admin', 'staff']} onRedirectToLogin={() => navigateTo('login')}>
          <AdminDashboard />
        </ProtectedRoute>
      )}
    </div>
  );
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3ba321',
          borderRadius: 8,
          fontFamily: 'Inter, system-ui, Arial, sans-serif',
        },
      }}
    >
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
