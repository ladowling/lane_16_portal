import { Button, Typography } from 'antd';
import type { Vehicle } from '../types';

const { Paragraph, Text, Title } = Typography;

type VehicleSummaryProps = {
  vehicle: Vehicle;
  onViewReport: () => void;
};

export function VehicleSummary({ vehicle, onViewReport }: VehicleSummaryProps) {
  return (
    <section className="mt-7 min-h-[386px] rounded-xl border border-[#575757] bg-[#0b0b0b] p-[30px] max-[620px]:p-[22px]">
      <Title className="!mb-6 !mt-0 !text-[28px] !leading-[1.15] !text-white" level={2}>{vehicle.detailsTitle}</Title>
      <Text className="block !text-xl !text-[#cfcfcf]">{vehicle.specs.join(' | ')}</Text>
      <Paragraph className="!mb-5 !mt-4 !text-xl !font-bold !text-white">{vehicle.description}</Paragraph>
      <div className="mt-[18px] grid min-h-[46px] w-[min(100%,320px)] place-items-center rounded-lg bg-[#ecffe8] text-[22px] font-medium text-[#102d0b]">Overall Condition: {vehicle.condition}</div>
      <Button type="primary" className="!mt-[50px] !h-16 !w-[min(100%,320px)] !rounded-lg !text-[23px] !font-bold" onClick={onViewReport}>
        View Condition Report
      </Button>
    </section>
  );
}
