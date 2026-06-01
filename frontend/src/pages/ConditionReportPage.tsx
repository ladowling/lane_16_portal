import { Divider, Typography } from 'antd';
import type { Vehicle } from '../types';

const { Paragraph, Text, Title } = Typography;

type ConditionReportPageProps = {
  vehicle: Vehicle;
};

const reportRows = [
  { area: 'EXTERIOR', note: 'Minor scratch on bumper', condition: 'Good' },
  { area: 'INTERIOR', note: 'Minor scratch on bumper', condition: 'Good' },
  { area: 'MECHANICAL/WARNING LIGHT', note: 'Check engine light', condition: 'Fair' },
  { area: 'INTERIOR ODOR', note: 'None', condition: 'Good' },
  { area: 'TIRES', note: '40% Thread', condition: 'Fair' },
];

export function ConditionReportPage({ vehicle }: ConditionReportPageProps) {
  return (
    <main className="mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <header className="text-center">
        <Title className="!mb-16 !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Condition Report</Title>
        <Text className="!text-white">{vehicle.detailsTitle}</Text>
      </header>
      <Divider className="!border-[#575757]" />

      <section className="space-y-5" aria-label="Condition report sections">
        {reportRows.map((row) => (
          <article className="flex items-center justify-between gap-6 rounded-lg border border-[#575757] bg-[#0b0b0b] p-6 max-[620px]:items-start max-[620px]:flex-col" key={row.area}>
            <div>
              <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>{row.area}</Title>
              <Paragraph className="!text-white">{row.note}</Paragraph>
            </div>
            <div className={`grid min-h-[46px] w-[min(100%,260px)] shrink-0 place-items-center rounded-lg px-5 text-lg font-bold ${row.condition === 'Good' ? 'bg-[#ecffe8] text-[#102d0b]' : 'bg-[#fff1c2] text-[#593f00]'}`}>Condition: {row.condition}</div>
          </article>
        ))}
      </section>

      <Divider className="!border-[#575757]" />
      <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-6">
        <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>ADDITIONAL INFO</Title>
        <Paragraph className="!text-white">Smoker vehicle: No</Paragraph>
        <Paragraph className="!text-white">Warning light: No</Paragraph>
      </section>
    </main>
  );
}
