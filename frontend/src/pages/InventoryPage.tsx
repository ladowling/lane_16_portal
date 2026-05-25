import { Col, Row, Typography } from 'antd';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';

const { Title } = Typography;

type InventoryPageProps = {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicleId: string) => void;
};

export function InventoryPage({ vehicles, onVehicleSelect }: InventoryPageProps) {
  return (
    <main className="page page-inventory">
      <Title className="page-title">Inventory</Title>
      <Row gutter={[34, 34]} className="inventory-grid">
        {vehicles.map((vehicle) => (
          <Col key={vehicle.id} xs={24} md={12} xl={8}>
            <VehicleCard vehicle={vehicle} onSelect={onVehicleSelect} />
          </Col>
        ))}
      </Row>
    </main>
  );
}
