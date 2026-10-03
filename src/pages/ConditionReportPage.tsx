import { Divider, Typography, Spin } from 'antd';
import type { Vehicle } from '../types';
import { getConditionReportRows, getVehicleDetailFields } from '../components/ConditionReportContent';

const { Paragraph, Text, Title } = Typography;

type ConditionReportPageProps = {
  vehicle?: Vehicle;
};

export function ConditionReportPage({ vehicle }: ConditionReportPageProps) {
  if (!vehicle) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#050505] pt-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <header className="text-center">
        <Title className="!mb-16 !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Condition Report</Title>
        <Text className="!text-white">{vehicle.detailsTitle}</Text>
      </header>
      <Divider className="!border-[#575757]" />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Condition report sections">
        {getConditionReportRows(vehicle).map((row) => (
          <article className="flex min-h-[170px] flex-col justify-between gap-6 rounded-lg border border-[#575757] bg-[#0b0b0b] p-6" key={row.area}>
            <div>
              <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>{row.area}</Title>
              <Paragraph className="!text-white">{row.note}</Paragraph>
            </div>
          </article>
        ))}
      </section>

      <section className="mb-8 mt-5 rounded-lg border border-[#575757] bg-[#0b0b0b] p-6" aria-label="Vehicle details">
        <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>VEHICLE DETAILS</Title>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {getVehicleDetailFields(vehicle).map(({ label, value }) => (
            <div key={label}>
              <div className="text-sm text-gray-400">{label}</div>
              <div className="text-lg font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider className="!border-[#575757]" />
    </main>
  );
}
