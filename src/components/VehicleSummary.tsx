import { useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  Armchair,
  Car,
  Cog,
  Compass,
  Gauge,
  PaintBucket,
  PanelTop,
  Settings2,
  Sofa,
} from 'lucide-react';
import { formatTitleStatus, type Vehicle } from '../types';
import { ConditionReportContent } from './ConditionReportContent';

const { Title } = Typography;

type VehicleSummaryProps = {
  vehicle: Vehicle;
  onViewReport: () => void;
};

type SpecField = {
  label: string;
  value: string;
  icon: typeof Gauge;
};

export function VehicleSummary({ vehicle }: VehicleSummaryProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const vin = vehicle.vin || '-';
  const titleStatusLabel = formatTitleStatus(vehicle.titleStatus);
  const titleStatusClass =
    vehicle.titleStatus === 'IN_HAND'
      ? 'bg-[#123414] text-[#5be36a]'
      : vehicle.titleStatus === 'LIEN'
        ? 'bg-[#3a2410] text-[#ffb066]'
        : 'bg-[#1c1c1c] text-[#c8c8c8]';

  const specFields: SpecField[] = [
    { label: 'Mileage', value: vehicle.mileage || '-', icon: Gauge },
    { label: 'Exterior Color', value: vehicle.exteriorColor || '-', icon: PaintBucket },
    { label: 'Interior Color', value: vehicle.interiorColor || '-', icon: Sofa },
    { label: 'Leather / Cloth', value: vehicle.leatherOrCloth || '-', icon: Armchair },
    { label: 'Engine', value: vehicle.engine || '-', icon: Cog },
    { label: 'Transmission', value: vehicle.transmission || '-', icon: Settings2 },
    { label: 'Drivetrain', value: vehicle.drivetrain || '-', icon: Compass },
    { label: 'Roof', value: vehicle.roof || '-', icon: PanelTop },
  ];

  return (
    <>
      <section className="mt-7 rounded-xl border border-[#575757] bg-[#0b0b0b] p-[30px] max-[620px]:p-[22px]">
        <Title className="!mb-6 !mt-0 !text-[28px] !leading-[1.15] !text-white" level={2}>
          {vehicle.detailsTitle}
        </Title>

        {/* Structured vehicle information box */}
        <div className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111]">
          <div className="flex items-center gap-2 border-b border-[#2a2a2a] bg-[#161616] px-5 py-4">
            <Car size={18} className="text-[#24d725]" />
            <span className="text-sm font-bold uppercase tracking-wider text-white">Vehicle Information</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-[#2a2a2a] px-5 py-4 text-sm">
            <span className="text-[#c8c8c8]">
              VIN: <span className="font-semibold text-white">{vin}</span>
            </span>
            <span className="flex items-center gap-2 text-[#c8c8c8]">
              Title Status:
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${titleStatusClass}`}>
                {titleStatusLabel}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 max-[480px]:grid-cols-1">
            {specFields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123414] text-[#24d725]">
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</div>
                  <div className="truncate text-sm font-semibold text-white" title={value}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {vehicle.description && (
          <p className="mt-5 text-base font-bold text-white">{vehicle.description}</p>
        )}

        <Button
          type="primary"
          className="!mt-6 !h-14 !w-[min(100%,320px)] !rounded-lg !text-[20px] !font-bold"
          onClick={() => setIsReportOpen(true)}
        >
          View Condition Reports
        </Button>
      </section>

      {/* Condition Report Modal */}
      <Modal
        centered
        footer={null}
        open={isReportOpen}
        onCancel={() => setIsReportOpen(false)}
        width={900}
        closeIcon={<CloseOutlined className="!text-white" />}
        className="[&_.ant-modal-content]:!bg-[#050505] [&_.ant-modal-content]:!p-8 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-header]:!bg-[#050505] [&_.ant-modal-header]:!px-5 [&_.ant-modal-header]:!py-5 [&_.ant-modal-header]:!mb-4 [&_.ant-modal-header]:!border-b [&_.ant-modal-header]:!border-[#333] [&_.ant-modal-title]:!text-white [&_.ant-modal-close]:!text-white [&_.ant-modal-close]:!top-5 [&_.ant-modal-close]:!right-6"
        title={
          <span className="text-xl font-bold text-white px-1">
            Condition Report — {vehicle.detailsTitle}
          </span>
        }
      >
        <ConditionReportContent vehicle={vehicle} />
      </Modal>
    </>
  );
}
