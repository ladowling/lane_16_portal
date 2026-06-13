import { ConfigProvider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { vehicles } from './data/vehicles';
import { SiteHeader } from './components/SiteHeader';
import { InventoryPage } from './pages/InventoryPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { ConditionReportPage } from './pages/ConditionReportPage';
import { ContactPage } from './pages/ContactPage';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import HowItWorksSeller from './pages/HowItWorksSeller';
import SubmitVehicle from './pages/SubmitsVehicle';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './Protectedroute';

type Page = 'home' | 'inventory' | 'details' | 'report' | 'contact' | 'howItWorks' | 'howItWorksSeller' | 'submitVehicle' | 'login' | 'adminDashboard';

const pagePaths: Record<Exclude<Page, 'details' | 'report'>, string> = {
  home: '/home',
  inventory: '/inventory',
  contact: '/contact',
  howItWorks: '/how-it-works',
  howItWorksSeller: '/how-it-works-seller',
  submitVehicle: '/submit-vehicle',
  login: '/login',
  adminDashboard: '/dashboard',
};

const getRouteState = (pathname: string) => {
  const [, firstSegment, secondSegment, thirdSegment] = pathname.split('/');

  if (!firstSegment) {
    return { page: 'home' as Page, vehicleId: vehicles[0].id, shouldReplace: true };
  }

  if (firstSegment === 'vehicle' && secondSegment) {
    const vehicleId = vehicles.some((vehicle) => vehicle.id === secondSegment) ? secondSegment : vehicles[0].id;
    return { page: thirdSegment === 'report' ? 'report' as Page : 'details' as Page, vehicleId };
  }

  const pathPage = (Object.entries(pagePaths).find(([, path]) => path === `/${firstSegment}`)?.[0] ?? 'home') as Page;
  return { page: pathPage, vehicleId: vehicles[0].id, shouldReplace: !Object.values(pagePaths).includes(`/${firstSegment}`) };
};

const getPagePath = (page: Page, vehicleId: string) => {
  if (page === 'details') {
    return `/vehicle/${vehicleId}`;
  }

  if (page === 'report') {
    return `/vehicle/${vehicleId}/report`;
  }

  return pagePaths[page];
};

function App() {
  const initialRoute = getRouteState(window.location.pathname);
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialRoute.vehicleId);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0],
    [selectedVehicleId]
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
  }, []);

  const navigateTo = (nextPage: Page, vehicleId = selectedVehicleId) => {
    const nextPath = getPagePath(nextPage, vehicleId);

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }

    setPage(nextPage);
    setSelectedVehicleId(vehicleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openVehicleDetails = (vehicleId: string) => {
    navigateTo('details', vehicleId);
  };

  const openPage = (nextPage: Page) => {
    navigateTo(nextPage);
  };

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
      <div className="min-h-screen bg-lane-ink font-sans text-white">
        <SiteHeader
          onHomeClick={() => openPage('home')}
          onInventoryClick={() => openPage('inventory')}
          onContactClick={() => openPage('contact')}
          onHowItWorksClick={() => openPage('howItWorks')}
          onHowItWorksSellerClick={() => openPage('howItWorksSeller')}
          onDealerLoginClick={() => openPage('login')}
          showDealerLogin={page === 'home'}
          showLogo={page !== 'home'}
          activePage={page}
        />
        {page === 'home' && <Home onSellVehicleClick={() => openPage('submitVehicle')} onContactClick={() => openPage('contact')} />}
        {page === 'inventory' && <InventoryPage vehicles={vehicles} onVehicleSelect={openVehicleDetails} />}
        {page === 'details' && <CarDetailsPage vehicle={selectedVehicle} onViewReport={() => navigateTo('report', selectedVehicle.id)} />}
        {page === 'report' && <ConditionReportPage vehicle={selectedVehicle} />}
        {page === 'contact' && <ContactPage />}
        {page === 'howItWorks' && <HowItWorks />}
        {page === 'howItWorksSeller' && <HowItWorksSeller />}
        {page === 'submitVehicle' && <SubmitVehicle />}
        {page === 'login' && <LoginPage onDealerLogin={() => openPage('inventory')} onAdminLogin={() => openPage('adminDashboard')} />}
        {page === 'adminDashboard' && (
          <ProtectedRoute allowedRole="admin" onRedirectToLogin={() => openPage('login')}>
            <AdminDashboard />
          </ProtectedRoute>
        )}

      </div>
    </ConfigProvider>
  );
}

export default App;
