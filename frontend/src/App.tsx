import { ConfigProvider } from 'antd';
import { useMemo, useState } from 'react';
import { vehicles } from './data/vehicles';
import { SiteHeader } from './components/SiteHeader';
import { InventoryPage } from './pages/InventoryPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { ConditionReportPage } from './pages/ConditionReportPage';
import { ContactPage } from './pages/ContactPage';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import HowItWorksSeller from './pages/HowItWorksSeller';

type Page = 'Home'|'inventory' | 'details' | 'report' | 'contact'| 'howItWorks' | 'howItWorksSeller' | 'submitVehicle';

function App() {
  const [page, setPage] = useState<Page>('inventory');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0].id);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0],
    [selectedVehicleId]
  );

  const openVehicleDetails = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPage = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          onHomeClick={() => openPage('Home')}
          onInventoryClick={() => openPage('inventory')}
          onContactClick={() => openPage('contact')}
          onHowItWorksClick={() => openPage('howItWorks')}
          onHowItWorksSellerClick={() => openPage('howItWorksSeller')}
          showDealerLogin={page === 'Home'}
        />
        {page === 'Home' && <Home />}
        {page === 'inventory' && <InventoryPage vehicles={vehicles} onVehicleSelect={openVehicleDetails} />}
        {page === 'details' && <CarDetailsPage vehicle={selectedVehicle} onViewReport={() => openPage('report')} />}
        {page === 'report' && <ConditionReportPage vehicle={selectedVehicle} />}
        {page === 'contact' && <ContactPage />}
        {page === 'howItWorks' && <HowItWorks />}
        {page === 'howItWorksSeller' && <HowItWorksSeller />}
        {/* {page === 'submitVehicle' && <SubmitVehicle />} */}

      </div>
    </ConfigProvider>
  );
}

export default App;
