import { ConfigProvider } from 'antd';
import { useMemo, useState } from 'react';
import './App.css';
import { vehicles } from './data/vehicles';
import { SiteHeader } from './components/SiteHeader';
import { InventoryPage } from './pages/InventoryPage';
import { CarDetailsPage } from './pages/CarDetailsPage';

type Page = 'inventory' | 'details';

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
      <div className="app-shell">
        <SiteHeader onInventoryClick={() => setPage('inventory')} />
        {page === 'inventory' ? (
          <InventoryPage vehicles={vehicles} onVehicleSelect={openVehicleDetails} />
        ) : (
          <CarDetailsPage vehicle={selectedVehicle} />
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
