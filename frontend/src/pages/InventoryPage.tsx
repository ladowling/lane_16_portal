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
    <main className="z--1 mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <Title className="!mb-[70px] !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Inventory</Title>
      <Row gutter={[34, 34]}>
        {vehicles.map((vehicle) => (
          <Col key={vehicle.id} xs={24} md={12} xl={8}>
            <VehicleCard vehicle={vehicle} onSelect={onVehicleSelect} />
          </Col>
        ))}
      </Row>
    </main>
  );
}
