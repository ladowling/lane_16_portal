import { Col, Row, Typography } from 'antd';
import type { Vehicle } from '../types';
import { BidPanel } from '../components/BidPanel';
import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleSummary } from '../components/VehicleSummary';

const { Title } = Typography;

type CarDetailsPageProps = {
  vehicle: Vehicle;
  onViewReport: () => void;
  onBidPlaced?: () => void;
};

export function CarDetailsPage({ vehicle, onViewReport, onBidPlaced }: CarDetailsPageProps) {
  const parseTitle = (title: string) => {
    const parts = title.split(/\s+/);
    const year = parts[0] && /^\d{4}$/.test(parts[0]) ? parts[0] : '';
    const make = parts[1] ?? '';
    const model = parts.slice(2).join(' ') ?? '';
    return { year, make, model };
  };

  const parseDetailsTitle = (detailsTitle: string) => {
    // detailsTitle often contains trim at the end, e.g. "2021 Ford F-150 XLT"
    const parts = detailsTitle.split(/\s+/);
    if (parts.length >= 3) {
      const trim = parts.slice(3).join(' ') || '';
      return { trim };
    }
    return { trim: '' };
  };

  const { year, make, model } = parseTitle(vehicle.title);
  const { trim } = parseDetailsTitle(vehicle.detailsTitle || '');

  
  const colorSpec = vehicle.specs.find((s) => s.includes('/')) || '';
  const [exteriorColor = '-', interiorColor = '-'] = colorSpec ? colorSpec.split('/') : ['-', '-'];

  const findSpec = (keyword: string) => vehicle.specs.find((s) => s.toLowerCase().includes(keyword)) || '-';
  const leatherCloth = /leather/i.test(vehicle.specs.join(' ')) ? 'Leather' : /cloth/i.test(vehicle.specs.join(' ')) ? 'Cloth' : '-';
  const drivetrain = findSpec('awd') !== '-' ? findSpec('awd') : findSpec('fwd') !== '-' ? findSpec('fwd') : findSpec('rwd') !== '-' ? findSpec('rwd') : '-';
  const transmission = findSpec('automatic') !== '-' ? findSpec('automatic') : findSpec('manual') !== '-' ? findSpec('manual') : '-';
  const engine = findSpec('l ') !== '-' ? findSpec('l ') : '-';
  const accidentHistory = findSpec('salvage') !== '-' ? findSpec('salvage') : findSpec('damage') !== '-' ? findSpec('damage') : '-';
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
