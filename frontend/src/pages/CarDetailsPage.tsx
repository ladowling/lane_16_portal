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

  // attempt to extract colors from specs (format like "Blue/Black")
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
      <div className="mb-8 rounded-lg border border-[#333] bg-[#0b0b0b] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Year</div>
            <div className="text-lg font-semibold text-white">{year || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Make</div>
            <div className="text-lg font-semibold text-white">{make || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Model</div>
            <div className="text-lg font-semibold text-white">{model || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Trim</div>
            <div className="text-lg font-semibold text-white">{trim || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">VIN #</div>
            <div className="text-lg font-semibold text-white">{vehicle.subtitle || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Mileage</div>
            <div className="text-lg font-semibold text-white">{vehicle.mileage || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Exterior Color</div>
            <div className="text-lg font-semibold text-white">{exteriorColor || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Interior Color</div>
            <div className="text-lg font-semibold text-white">{interiorColor || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Leather / Cloth</div>
            <div className="text-lg font-semibold text-white">{leatherCloth}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Roof</div>
            <div className="text-lg font-semibold text-white">{findSpec('sunroof') !== '-' ? 'Sunroof' : findSpec('hardtop') !== '-' ? 'Hardtop' : findSpec('softtop') !== '-' ? 'Softtop' : '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Drivetrain</div>
            <div className="text-lg font-semibold text-white">{drivetrain}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Transmission</div>
            <div className="text-lg font-semibold text-white">{transmission}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Engine</div>
            <div className="text-lg font-semibold text-white">{engine}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Title Status</div>
            <div className="text-lg font-semibold text-white">{vehicle.status || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Accident History</div>
            <div className="text-lg font-semibold text-white">{accidentHistory}</div>
          </div>
        </div>
      </div>

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
