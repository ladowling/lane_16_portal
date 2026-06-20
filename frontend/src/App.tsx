import { ConfigProvider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { vehicles as staticVehicles } from './data/vehicles';
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
import { fetchVehicles, getUploadUrl } from './api';
import type { Vehicle } from './types';

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
    return { page: 'home' as Page, vehicleId: staticVehicles[0].id, shouldReplace: true };
  }

  if (firstSegment === 'vehicle' && secondSegment) {
    const vehicleId = secondSegment || staticVehicles[0].id;
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
    vehicleId: staticVehicles[0].id,
    shouldReplace: !Object.values(pagePaths).includes(`/${firstSegment}`),
  };
};

const getPagePath = (page: Page, vehicleId: string) => {
  if (page === 'details') return `/vehicle/${vehicleId}`;
  if (page === 'report') return `/vehicle/${vehicleId}/report`;
  return pagePaths[page];
};

const dealerVisibleStatuses = new Set(['APPROVED', 'BIDDING_ACTIVE', 'BIDDING_ENDED']);

const getArrayPayload = (payload: unknown) => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.items)) return record.items;
    if (Array.isArray(record.vehicles)) return record.vehicles;
  }
  return [];
};

const getStringValue = (record: Record<string, unknown>, keys: string[], fallback = '') => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number') return String(value);
  }
  return fallback;
};

const formatCurrency = (value: unknown) => {
  if (typeof value === 'string' && value.trim()) return value.startsWith('$') ? value : `$${value}`;
  if (typeof value === 'number') return `$${value.toLocaleString()}`;
  return '$0';
};

const formatMileage = (value: unknown) => {
  if (typeof value === 'number') return `${value.toLocaleString()} mi`;
  if (typeof value === 'string' && value.trim()) return value;
  return 'Mileage unavailable';
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const getDealerVehicleStatusLabel = (status: string, startTime: string, endTime: string) => {
  if (status === 'APPROVED') {
    const formattedStart = formatDateTime(startTime);
    return formattedStart ? `Starts ${formattedStart}` : 'Approved - bidding pending';
  }

  if (status === 'BIDDING_ACTIVE') {
    const formattedEnd = formatDateTime(endTime);
    return formattedEnd ? `Ends ${formattedEnd}` : 'Bidding active';
  }

  if (status === 'BIDDING_ENDED') return 'Bidding ended';
  return status.replace(/_/g, ' ');
};

const mapDealerVehicle = (item: unknown, index: number): Vehicle | null => {
  const record = (item ?? {}) as Record<string, unknown>;
  const status = getStringValue(record, ['status'], 'PENDING').toUpperCase();

  if (!dealerVisibleStatuses.has(status)) {
    return null;
  }

  const fallbackVehicle = staticVehicles[index % staticVehicles.length] ?? staticVehicles[0];
  const rawUploads = Array.isArray(record.uploads) ? record.uploads : [];
  const uploadUrls = rawUploads
    .map((upload) => {
      if (typeof upload === 'string') return getUploadUrl(upload);
      if (upload && typeof upload === 'object') {
        const uploadRecord = upload as Record<string, unknown>;
        const url = getStringValue(uploadRecord, ['url']);
        const id = getStringValue(uploadRecord, ['id', '_id']);
        return url || (id ? getUploadUrl(id) : '');
      }
      return '';
    })
    .filter(Boolean);
  const galleryImageSrcs = uploadUrls.length ? uploadUrls : fallbackVehicle.galleryImageSrcs;
  const year = getStringValue(record, ['year']);
  const make = getStringValue(record, ['make']);
  const model = getStringValue(record, ['model']);
  const trim = getStringValue(record, ['trim', 'status']);
  const title = getStringValue(record, ['vehicleName']) || [year, make, model].filter(Boolean).join(' ') || fallbackVehicle.title;
  const auctionStartTime = getStringValue(record, ['auctionStartTime', 'auctionStartAt', 'auctionStartedAt']);
  const auctionEndTime = getStringValue(record, ['auctionEndTime', 'auctionEndAt']);
  const highestBid = formatCurrency(record.highestBid);
  const minimumBid = formatCurrency(record.minimumAcceptablePrice);

  return {
    ...fallbackVehicle,
    id: getStringValue(record, ['id', '_id'], fallbackVehicle.id),
    title,
    subtitle: getStringValue(record, ['vin'], fallbackVehicle.subtitle),
    mileage: formatMileage(record.mileage),
    status: (trim || status.replace(/_/g, ' ')) as Vehicle['status'],
    highestBid,
    currentHighBid: highestBid,
    nextMinimumBid: formatCurrency(record.bidIncrementNo) || minimumBid,
    endsIn: getDealerVehicleStatusLabel(status, auctionStartTime, auctionEndTime),
    biddingStatusLabel: getDealerVehicleStatusLabel(status, auctionStartTime, auctionEndTime),
    canBid: status === 'BIDDING_ACTIVE',
    bidCount: typeof record.bidCount === 'number' ? record.bidCount : Number(record.bidCount) || 0,
    imageSrc: galleryImageSrcs[0] || fallbackVehicle.imageSrc,
    galleryImageSrcs,
    detailsTitle: [year, make, model, trim].filter(Boolean).join(' ') || title,
    specs: [
      formatMileage(record.mileage),
      getStringValue(record, ['location']),
      [getStringValue(record, ['exteriorColor']), getStringValue(record, ['interiorColor'])].filter(Boolean).join('/'),
      getStringValue(record, ['condition']),
    ].filter(Boolean),
    description: getStringValue(record, ['description', 'sellerNote'], 'Seller-submitted vehicle listing.'),
    condition: getStringValue(record, ['condition'], fallbackVehicle.condition),
    // Auction timing fields for live countdown and bidding
    auctionStartTime: auctionStartTime || undefined,
    auctionEndTime: auctionEndTime || undefined,
    bidIncrementAmount: typeof record.bidIncrementNo === 'number' ? record.bidIncrementNo : Number(record.bidIncrementNo) || undefined,
  };
};
// ---------------------------------------------------------------------------
// Inner component - needs to be inside AuthProvider to call useAuth()
// ---------------------------------------------------------------------------
function AppInner() {
  const { user, token, logout } = useAuth();

  const initialRoute = getRouteState(window.location.pathname);
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialRoute.vehicleId);
  const [inventoryVehicles, setInventoryVehicles] = useState<Vehicle[]>(staticVehicles);

  const selectedVehicle = useMemo(
    () => inventoryVehicles.find((v) => v.id === selectedVehicleId) ?? inventoryVehicles[0] ?? staticVehicles[0],
    [inventoryVehicles, selectedVehicleId],
  );

  // Expose loadDealerInventory as a stable callback so CarDetailsPage can call it after a bid
  const loadDealerInventory = useCallback(async () => {
    if (user?.role !== 'dealer' || !token) return;
    try {
      const response = await fetchVehicles(token);
      const approvedVehicles = getArrayPayload(response)
        .map(mapDealerVehicle)
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle));
      setInventoryVehicles(approvedVehicles);
      if (approvedVehicles.length && !approvedVehicles.some((vehicle) => vehicle.id === selectedVehicleId)) {
        setSelectedVehicleId(approvedVehicles[0].id);
      }
    } catch {
      setInventoryVehicles([]);
    }
  }, [token, user?.role, selectedVehicleId]);

  useEffect(() => {
    if (user?.role !== 'dealer' || !token) {
      setInventoryVehicles(staticVehicles);
      return;
    }
    void loadDealerInventory();
  }, [loadDealerInventory, token, user?.role]);
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
          onContactClick={() => openPage('contact')} onLoginClick={function (): void {
            throw new Error('Function not implemented.');
          } }        />
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
          <InventoryPage vehicles={inventoryVehicles} onVehicleSelect={openVehicleDetails} />
        </ProtectedRoute>
      )}
      {page === 'details' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          <CarDetailsPage
            vehicle={selectedVehicle}
            onViewReport={() => navigateTo('report', selectedVehicle.id)}
            onBidPlaced={() => void loadDealerInventory()}
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

