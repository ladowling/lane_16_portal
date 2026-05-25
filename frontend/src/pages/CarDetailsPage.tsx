import { Col, Row, Typography } from 'antd';
import type { Vehicle } from '../types';
import { BidPanel } from '../components/BidPanel';
import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleSummary } from '../components/VehicleSummary';

const { Title } = Typography;

type CarDetailsPageProps = {
  vehicle: Vehicle;
};

export function CarDetailsPage({ vehicle }: CarDetailsPageProps) {
  return (
    <main className="page page-details">
      <Title className="page-title">Car Details</Title>
      <Row gutter={[28, 28]} align="stretch">
        <Col xs={24} lg={13}>
          <VehicleGallery vehicle={vehicle} />
          <VehicleSummary vehicle={vehicle} />
        </Col>
        <Col xs={24} lg={11}>
          <BidPanel vehicle={vehicle} />
        </Col>
      </Row>
    </main>
  );
}
