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
 // { area: 'TIRES', note: '40% Thread', condition: 'Fair' },
  { area: 'INTERIOR ODOR', note: 'None', condition: 'Good' },
  { area: 'TIRES', note: '40% Thread', condition: 'Fair' },
];

const parseTitle = (title: string) => {
  const parts = title.split(/\s+/);
  const year = parts[0] && /^\d{4}$/.test(parts[0]) ? parts[0] : '';
  const make = parts[1] ?? '';
  const model = parts.slice(2).join(' ') ?? '';

  return { year, make, model };
};

const parseDetailsTitle = (detailsTitle: string) => {
  const parts = detailsTitle.split(/\s+/);

  if (parts.length >= 3) {
    const trim = parts.slice(3).join(' ') || '';
    return { trim };
  }

  return { trim: '' };
};

export function ConditionReportPage({ vehicle }: ConditionReportPageProps) {
  const { year, make, model } = parseTitle(vehicle.title);
  const { trim } = parseDetailsTitle(vehicle.detailsTitle || '');
  const colorSpec = vehicle.specs.find((spec) => spec.includes('/')) || '';
  const [exteriorColor = '-', interiorColor = '-'] = colorSpec ? colorSpec.split('/') : ['-', '-'];
  const findSpec = (keyword: string) => vehicle.specs.find((spec) => spec.toLowerCase().includes(keyword)) || '-';
  const leatherCloth = /leather/i.test(vehicle.specs.join(' ')) ? 'Leather' : /cloth/i.test(vehicle.specs.join(' ')) ? 'Cloth' : '-';
  const drivetrain = findSpec('awd') !== '-' ? findSpec('awd') : findSpec('fwd') !== '-' ? findSpec('fwd') : findSpec('rwd') !== '-' ? findSpec('rwd') : '-';
  const transmission = findSpec('automatic') !== '-' ? findSpec('automatic') : findSpec('manual') !== '-' ? findSpec('manual') : '-';
  const engine = findSpec('l ') !== '-' ? findSpec('l ') : '-';
  const accidentHistory = findSpec('salvage') !== '-' ? findSpec('salvage') : findSpec('damage') !== '-' ? findSpec('damage') : '-';

  return (
    <main className="mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <header className="text-center">
        <Title className="!mb-16 !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Condition Report</Title>
        <Text className="!text-white">{vehicle.detailsTitle}</Text>
      </header>
      <Divider className="!border-[#575757]" />

      

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5" aria-label="Condition report sections">
        {reportRows.map((row) => (
          <article className="flex min-h-[170px] flex-col justify-between gap-6 rounded-lg border border-[#575757] bg-[#0b0b0b] p-6" key={row.area}>
            <div>
              <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>{row.area}</Title>
              <Paragraph className="!text-white">{row.note}</Paragraph>
            </div>
            {/* <div className={`grid min-h-[46px] w-[min(100%,260px)] shrink-0 place-items-center rounded-lg px-5 text-lg font-bold ${row.condition === 'Good' ? 'bg-[#ecffe8] text-[#102d0b]' : 'bg-[#fff1c2] text-[#593f00]'}`}>Condition: {row.condition}</div> */}
          </article>
        ))}
      </section>

      <section className="mb-8 mt-5 rounded-lg border border-[#575757] bg-[#0b0b0b] p-6" aria-label="Vehicle details">
        <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>VEHICLE DETAILS</Title>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          {/* <div>
            <div className="text-sm text-gray-400">Title Status</div>
            <div className="text-lg font-semibold text-white">{vehicle.status || '-'}</div>
          </div> */}
          <div>
            <div className="text-sm text-gray-400">Accident History</div>
            <div className="text-lg font-semibold text-white">{accidentHistory}</div>
          </div>
        </div>
      </section>

      <Divider className="!border-[#575757]" />
      {/* <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-6">
        <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>ADDITIONAL INFO</Title>
        <Paragraph className="!text-white">Smoker vehicle: No</Paragraph>
        <Paragraph className="!text-white">Warning light: No</Paragraph>
      </section> */}
    </main>
  );
}
