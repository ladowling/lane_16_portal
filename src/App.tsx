import { Button, ConfigProvider, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { ProtectedRoute } from './Protectedroute';
import { AuthProvider, useAuth } from './Authontext';
import { fetchVehicles, getUploadUrl } from './api';
import { formatVehicleOption, type Vehicle } from './types';
import { SiteFooter } from './components/SiteFooter';
import { trackPageview } from './analytics';

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
  | 'dashboard'
  | 'privacy'
  | 'terms';

const pagePaths: Record<Exclude<Page, 'details' | 'report'>, string> = {
  home: '/home',
  inventory: '/inventory',
  contact: '/contact',
  howItWorks: '/how-it-works',
  howItWorksSeller: '/how-it-works-seller',
  submitVehicle: '/submit-vehicle',
  login: '/login',
  dashboard: '/dashboard',
  privacy: '/privacy',
  terms: '/terms',
};

const pageTitles: Record<Page, string> = {
  home: 'Home',
  inventory: 'Inventory',
  details: 'Vehicle Details',
  report: 'Condition Report',
  contact: 'Contact',
  howItWorks: 'How It Works — Dealers',
  howItWorksSeller: 'How It Works — Sellers',
  submitVehicle: 'Submit Vehicle',
  login: 'Login',
  dashboard: 'Admin Dashboard',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
};

const AUTH_STORAGE_KEY = 'lane16_auth';
const LAST_ROUTE_STORAGE_KEY = 'lane16_last_route';

const normalizeRoutePath = (path: string) => {
  const [pathWithoutQuery] = path.split(/[?#]/);
  const pathWithSlash = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`;
  return pathWithSlash.length > 1 ? pathWithSlash.replace(/\/+$/, '') : pathWithSlash;
};

const getHashRoutePath = () => {
  const hashPath = window.location.hash.replace(/^#/, '');
  return hashPath.startsWith('/') ? normalizeRoutePath(hashPath) : '';
};

const getCurrentRoutePath = () => getHashRoutePath() || normalizeRoutePath(window.location.pathname);

const getRouteUrl = (path: string) => `/#${normalizeRoutePath(path)}`;

const getRouteState = (pathname: string) => {
  const [, firstSegment, secondSegment, thirdSegment] = normalizeRoutePath(pathname).split('/');

  if (!firstSegment) {
    return { page: 'home' as Page, vehicleId: '', shouldReplace: true };
  }

  if (firstSegment === 'vehicle' && secondSegment) {
    return {
      page: thirdSegment === 'report' ? ('report' as Page) : ('details' as Page),
      vehicleId: secondSegment,
    };
  }

  const pathPage = (
    Object.entries(pagePaths).find(([, path]) => path === `/${firstSegment}`)?.[0] ?? 'home'
  ) as Page;

  return {
    page: pathPage,
    vehicleId: '',
    shouldReplace: !Object.values(pagePaths).includes(`/${firstSegment}`),
  };
};

const getPagePath = (page: Page, vehicleId: string) => {
  if (page === 'details') return `/vehicle/${vehicleId}`;
  if (page === 'report') return `/vehicle/${vehicleId}/report`;
  return pagePaths[page];
};

const getPersistablePath = (page: Page, vehicleId: string) => {
  const path = getPagePath(page, vehicleId);
  return path === '/home' || path === '/login' ? null : path;
};

const reportPageview = (page: Page, vehicleId: string) => {
  trackPageview(getPagePath(page, vehicleId), pageTitles[page]);
};

const persistRoutePath = (path: string | null) => {
  if (!path) return;
  localStorage.setItem(LAST_ROUTE_STORAGE_KEY, path);
};

const clearPersistedRoutePath = () => {
  localStorage.removeItem(LAST_ROUTE_STORAGE_KEY);
};

const hasStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as { token?: unknown; user?: unknown };
    return Boolean(parsed.token && parsed.user);
  } catch {
    return false;
  }
};

const getInitialPath = (pathname: string) => {
  const routePath = normalizeRoutePath(pathname);

  if (routePath !== '/') return routePath;

  if (!hasStoredAuth()) return pathname;

  const storedPath = localStorage.getItem(LAST_ROUTE_STORAGE_KEY);
  if (!storedPath || !storedPath.startsWith('/') || storedPath === '/home' || storedPath === '/login') {
    return pathname;
  }

  return getRouteState(storedPath).shouldReplace ? pathname : storedPath;
};

const dealerVisibleStatuses = new Set(['APPROVED', 'BIDDING_ACTIVE']);

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

// The seller form saves warning lights and interior odor only inside `condition`, as
// "exterior | mechanical | tires | warning lights | odor". Read them back only when the first
// three parts match the dedicated fields, so a differently formatted summary isn't misread.
const parseSellerConditionSummary = (condition: string, exterior: string, mechanical: string, tires: string) => {
  const parts = condition.split(' | ');
  const isSellerFormSummary =
    parts.length === 5 && parts[0] === exterior && parts[1] === mechanical && parts[2] === tires;
  return isSellerFormSummary ? { warningLights: parts[3], interiorOdor: parts[4] } : {};
};

const getInteriorOdorLabel = (summaryOdor: string | undefined, smokerVehicle: boolean | undefined) => {
  if (summaryOdor) return formatVehicleOption(summaryOdor);
  if (smokerVehicle === true) return 'Smoker';
  if (smokerVehicle === false) return 'Not a smoker vehicle';
  return '';
};

// Neutral placeholder shown when a vehicle has no uploaded photos
const NO_IMAGE_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22260%22 viewBox=%220 0 400 260%22%3E%3Crect width=%22400%22 height=%22260%22 fill=%22%23111%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2218%22 font-family=%22Arial%22 fill=%22%23444%22%3ENo Photo%3C/text%3E%3C/svg%3E';

const mapDealerVehicle = (item: unknown): Vehicle | null => {
  const record = (item ?? {}) as Record<string, unknown>;
  const status = getStringValue(record, ['status'], 'PENDING').toUpperCase();

  if (!dealerVisibleStatuses.has(status)) {
    return null;
  }

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

  const year = getStringValue(record, ['year']);
  const make = getStringValue(record, ['make']);
  const model = getStringValue(record, ['model']);
  const trim = getStringValue(record, ['trim']);
  const title = getStringValue(record, ['vehicleName']) || [year, make, model].filter(Boolean).join(' ') || 'Unknown Vehicle';
  const auctionStartTime = getStringValue(record, ['auctionStartTime', 'auctionStartAt', 'auctionStartedAt']);
  const auctionEndTime = getStringValue(record, ['auctionEndTime', 'auctionEndAt']);
  const highestBid = formatCurrency(record.highestBid);
  const bidIncrement = Number(record.bidIncrementNo) || 0;
  const imageSrc = uploadUrls[0] || NO_IMAGE_PLACEHOLDER;
  const exteriorCondition = getStringValue(record, ['exteriorCondition']);
  const mechanicalCondition = getStringValue(record, ['mechanicalCondition']);
  const tireCondition = getStringValue(record, ['tireCondition']);
  const conditionSummary = parseSellerConditionSummary(
    getStringValue(record, ['condition']),
    exteriorCondition,
    mechanicalCondition,
    tireCondition,
  );
  const smokerVehicle = typeof record.smokerVehicle === 'boolean' ? record.smokerVehicle : undefined;

  return {
    id: getStringValue(record, ['id', '_id']),
    title,
    subtitle: getStringValue(record, ['vin'], 'N/A'),
    mileage: formatMileage(record.mileage),
    status: (trim || status.replace(/_/g, ' ')) as Vehicle['status'],
    highestBid,
    currentHighBid: highestBid,
    nextMinimumBid: formatCurrency((Number(record.highestBid) || 0) + bidIncrement),
    endsIn: getDealerVehicleStatusLabel(status, auctionStartTime, auctionEndTime),
    biddingStatusLabel: getDealerVehicleStatusLabel(status, auctionStartTime, auctionEndTime),
    canBid: status === 'BIDDING_ACTIVE',
    bidCount: typeof record.bidCount === 'number' ? record.bidCount : Number(record.bidCount) || 0,
    imageSrc,
    galleryImageSrcs: uploadUrls.length ? uploadUrls : [NO_IMAGE_PLACEHOLDER],
    detailsTitle: [year, make, model, trim].filter(Boolean).join(' ') || title,
    specs: [
      formatMileage(record.mileage),
      getStringValue(record, ['location']),
      [getStringValue(record, ['exteriorColor']), getStringValue(record, ['interiorColor'])].filter(Boolean).join('/'),
      getStringValue(record, ['condition']),
    ].filter(Boolean),
    description: getStringValue(record, ['description', 'sellerNote'], ''),
    condition: getStringValue(record, ['condition'], ''),
    // Auction timing fields
    auctionStartTime: auctionStartTime || undefined,
    auctionEndTime: auctionEndTime || undefined,
    bidIncrementAmount: bidIncrement || undefined,
    reserveMet: Boolean(record.reserveMet),
    engine: getStringValue(record, ['engine']),
    leatherOrCloth: formatVehicleOption(getStringValue(record, ['leatherOrCloth', 'leatherCloth'])),
    roof: formatVehicleOption(getStringValue(record, ['roof'])),
    drivetrain: formatVehicleOption(getStringValue(record, ['drivetrain'])),
    transmission: formatVehicleOption(getStringValue(record, ['transmission'])),
    accidentHistory: getStringValue(record, ['accidentHistory']),
    additionalDisclosures: getStringValue(record, ['additionalDisclosures', 'notes']),
    titleStatus: (getStringValue(record, ['titleStatus']) || undefined) as Vehicle['titleStatus'],
    vin: getStringValue(record, ['vin']),
    year,
    make,
    model,
    trim,
    location: getStringValue(record, ['location']),
    exteriorColor: getStringValue(record, ['exteriorColor']),
    interiorColor: getStringValue(record, ['interiorColor']),
    exteriorCondition,
    interiorCondition: getStringValue(record, ['interiorCondition']),
    mechanicalCondition,
    tireCondition,
    warningLights: conditionSummary.warningLights,
    interiorOdor: getInteriorOdorLabel(conditionSummary.interiorOdor, smokerVehicle),
    smokerVehicle,
  };
};
function VehicleUnavailable({ onBackToInventory }: { onBackToInventory: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-2xl font-semibold text-white">This vehicle isn't available</p>
      <p className="text-[#c8c8c8]">It may have been removed, or its auction may no longer be open.</p>
      <Button type="primary" size="large" onClick={onBackToInventory}>
        Back to Inventory
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner component - needs to be inside AuthProvider to call useAuth()
// ---------------------------------------------------------------------------
function AppInner() {
  const { user, token, logout } = useAuth();

  const initialPath = getInitialPath(getCurrentRoutePath());
  const initialRoute = getRouteState(initialPath);
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialRoute.vehicleId);
  const [inventoryVehicles, setInventoryVehicles] = useState<Vehicle[]>([]);
  // Dealers start out loading so nothing is shown before the server responds
  const [isLoadingInventory, setIsLoadingInventory] = useState(user?.role === 'dealer' && Boolean(token));

  // Only ever show the requested vehicle — never fall back to a different one
  const selectedVehicle = useMemo(
    () => inventoryVehicles.find((v) => v.id === selectedVehicleId),
    [inventoryVehicles, selectedVehicleId],
  );

  const loadDealerInventory = useCallback(async () => {
    if (user?.role !== 'dealer' || !token) return;
    setIsLoadingInventory(true);
    try {
      const response = await fetchVehicles(token);
      const approvedVehicles = getArrayPayload(response)
        .map(mapDealerVehicle)
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle));
      setInventoryVehicles(approvedVehicles);
    } catch (error) {
      // Keep whatever was already loaded rather than blanking the page on a failed refresh
      message.error(error instanceof Error ? error.message : 'Unable to load vehicles.');
    } finally {
      setIsLoadingInventory(false);
    }
  }, [token, user?.role]);

  // Also refetches when a different vehicle is opened, so its bid details are current
  useEffect(() => {
    if (user?.role !== 'dealer' || !token) {
      setInventoryVehicles([]);
      setIsLoadingInventory(false);
      return;
    }
    void loadDealerInventory();
  }, [loadDealerInventory, token, user?.role, selectedVehicleId]);
  useEffect(() => {
    const routePath = initialRoute.shouldReplace
      ? getPagePath(initialRoute.page, initialRoute.vehicleId)
      : initialPath;

    if (window.location.pathname + window.location.hash !== getRouteUrl(routePath)) {
      window.history.replaceState(null, '', getRouteUrl(routePath));
    }

    persistRoutePath(getPersistablePath(initialRoute.page, initialRoute.vehicleId));
    reportPageview(initialRoute.page, initialRoute.vehicleId);

    const handlePopState = () => {
      const nextRoute = getRouteState(getCurrentRoutePath());
      setPage(nextRoute.page);
      setSelectedVehicleId(nextRoute.vehicleId);
      persistRoutePath(getPersistablePath(nextRoute.page, nextRoute.vehicleId));
      reportPageview(nextRoute.page, nextRoute.vehicleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = (nextPage: Page, vehicleId = selectedVehicleId) => {
    const nextPath = getPagePath(nextPage, vehicleId);
    const nextUrl = getRouteUrl(nextPath);
    if (window.location.pathname + window.location.hash !== nextUrl) {
      window.history.pushState(null, '', nextUrl);
    }
    setPage(nextPage);
    setSelectedVehicleId(vehicleId);
    persistRoutePath(getPersistablePath(nextPage, vehicleId));
    reportPageview(nextPage, vehicleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openVehicleDetails = (vehicleId: string) => navigateTo('details', vehicleId);
  const openPage = (nextPage: Page) => navigateTo(nextPage);

  const handleLogout = () => {
    clearPersistedRoutePath();
    logout();
    navigateTo('home');
  };

  return (
    <div className="flex min-h-screen flex-col bg-lane-ink font-sans text-white">
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

      <main className="flex flex-1 flex-col">
        {/* ── Public pages ────────────────────────────────────────────── */}
      {page === 'home' && (
        <Home
          onSellVehicleClick={() => openPage('submitVehicle')}
          onContactClick={() => openPage('contact')}
          onLoginClick={() => openPage('login')}
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
      {page === 'privacy' && <PrivacyPage />}
      {page === 'terms' && <TermsPage />}

      {/* ── Dealer-only pages ────────────────────────────────────────── */}
      {page === 'inventory' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          <InventoryPage vehicles={inventoryVehicles} isLoading={isLoadingInventory} onVehicleSelect={openVehicleDetails} />
        </ProtectedRoute>
      )}
      {page === 'details' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          {!selectedVehicle && !isLoadingInventory ? (
            <VehicleUnavailable onBackToInventory={() => navigateTo('inventory')} />
          ) : (
            <CarDetailsPage
              vehicle={selectedVehicle}
              onViewReport={() => navigateTo('report', selectedVehicleId)}
            />
          )}
        </ProtectedRoute>
      )}
      {page === 'report' && (
        <ProtectedRoute allowedRole="dealer" onRedirectToLogin={() => navigateTo('login')}>
          {!selectedVehicle && !isLoadingInventory ? (
            <VehicleUnavailable onBackToInventory={() => navigateTo('inventory')} />
          ) : (
            <ConditionReportPage vehicle={selectedVehicle} />
          )}
        </ProtectedRoute>
      )}

      {/* ── Admin-only pages ─────────────────────────────────────────── */}
      {page === 'dashboard' && (
        <ProtectedRoute allowedRole={['admin', 'staff']} onRedirectToLogin={() => navigateTo('login')}>
          <AdminDashboard />
        </ProtectedRoute>
      )}
      </main>
      
      {page !== 'dashboard' && <SiteFooter />}
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
