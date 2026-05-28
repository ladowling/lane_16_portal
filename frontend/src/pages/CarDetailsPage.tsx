import { Col, Row, Typography } from 'antd';
import type { Vehicle } from '../types';
import { BidPanel } from '../components/BidPanel';
import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleSummary } from '../components/VehicleSummary';

const { Title } = Typography;

type CarDetailsPageProps = {
  vehicle: Vehicle;
  onViewReport: () => void;
};

export function CarDetailsPage({ vehicle, onViewReport }: CarDetailsPageProps) {
  return (
    <main className="mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <Title className="!mb-16 !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Car Details</Title>
      <Row gutter={[28, 28]} align="stretch">
        <Col xs={24} lg={13}>
          <VehicleGallery vehicle={vehicle} />
          <VehicleSummary vehicle={vehicle} onViewReport={onViewReport} />
        </Col>
        <Col xs={24} lg={11}>
          <BidPanel vehicle={vehicle} />
        </Col>
      </Row>
    </main>
  );
}
