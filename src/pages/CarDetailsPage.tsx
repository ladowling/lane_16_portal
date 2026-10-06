import { Col, Row, Typography, Spin } from 'antd';
import type { Vehicle } from '../types';
import { BidPanel } from '../components/BidPanel';
import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleSummary } from '../components/VehicleSummary';

const { Title } = Typography;

type CarDetailsPageProps = {
  vehicle?: Vehicle;
  onViewReport: () => void;
  onBidPlaced?: () => void;
};

export function CarDetailsPage({ vehicle, onViewReport, onBidPlaced }: CarDetailsPageProps) {
  if (!vehicle) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-black pt-20">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <main className="mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <Title className="!mb-16 !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Car Details</Title>
     

      <Row gutter={[28, 28]} align="stretch">
        <Col xs={24} lg={13}>
          <VehicleGallery vehicle={vehicle} />
          <VehicleSummary vehicle={vehicle} onViewReport={onViewReport} />
        </Col>
        <Col xs={24} lg={11}>
          <BidPanel vehicle={vehicle} onBidPlaced={onBidPlaced} />
        </Col>
      </Row>
    </main>
  );
}
