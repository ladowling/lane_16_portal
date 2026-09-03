import { Divider, Typography } from 'antd';
import { formatTitleStatus, type Vehicle } from '../types';

const { Paragraph, Title } = Typography;

type ConditionReportContentProps = {
  vehicle: Vehicle;
};

const reportRows = [
  { area: 'EXTERIOR', note: 'Minor scratch on bumper', condition: 'Good' },
  { area: 'INTERIOR', note: 'Minor scratch on bumper', condition: 'Good' },
  { area: 'MECHANICAL/WARNING LIGHT', note: 'Check engine light', condition: 'Fair' },
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

export function ConditionReportContent({ vehicle }: ConditionReportContentProps) {
  const { year, make, model } = parseTitle(vehicle.title);
  const { trim } = parseDetailsTitle(vehicle.detailsTitle || '');
  const colorSpec = vehicle.specs.find((spec) => spec.includes('/')) || '';
  const [exteriorColor = '-', interiorColor = '-'] = colorSpec ? colorSpec.split('/') : ['-', '-'];
  const findSpec = (keyword: string) => vehicle.specs.find((s) => s.toLowerCase().includes(keyword)) || '-';
  const leatherCloth = vehicle.leatherOrCloth || (/leather/i.test(vehicle.specs.join(' ')) ? 'Leather' : /cloth/i.test(vehicle.specs.join(' ')) ? 'Cloth' : '-');
  const drivetrain = vehicle.drivetrain || (findSpec('awd') !== '-' ? findSpec('awd') : findSpec('fwd') !== '-' ? findSpec('fwd') : findSpec('rwd') !== '-' ? findSpec('rwd') : '-');
  const transmission = vehicle.transmission || (findSpec('automatic') !== '-' ? findSpec('automatic') : findSpec('manual') !== '-' ? findSpec('manual') : '-');
  const engine = vehicle.engine || (findSpec('l ') !== '-' ? findSpec('l ') : '-');
  const accidentHistory = vehicle.accidentHistory || (findSpec('salvage') !== '-' ? findSpec('salvage') : findSpec('damage') !== '-' ? findSpec('damage') : '-');
  const roof = vehicle.roof || (findSpec('sunroof') !== '-' ? 'Sunroof' : findSpec('hardtop') !== '-' ? 'Hardtop' : findSpec('softtop') !== '-' ? 'Softtop' : '-');
  const additionalDisclosures = vehicle.additionalDisclosures || '-';

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      {/* Condition sections */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Condition report sections">
        {reportRows.map((row) => (
          <article
            className="flex min-h-[140px] flex-col justify-between gap-4 rounded-lg border border-[#575757] bg-[#0b0b0b] p-5"
            key={row.area}
          >
            <div>
              <Title className="!mt-0 !text-[18px] !font-bold !text-white" level={3}>{row.area}</Title>
              <Paragraph className="!mb-0 !text-[#cfcfcf]">{row.note}</Paragraph>
            </div>
          </article>
        ))}
      </section>

      <Divider className="!border-[#575757]" />

      {/* Vehicle details */}
      <section className="mb-4 rounded-lg border border-[#575757] bg-[#0b0b0b] p-5" aria-label="Vehicle details">
        <Title className="!mt-0 !text-[20px] !font-bold !text-white" level={3}>VEHICLE DETAILS</Title>
        <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
          {[
            { label: 'Year', value: year || '-' },
            { label: 'Make', value: make || '-' },
            { label: 'Model', value: model || '-' },
            { label: 'Trim', value: trim || '-' },
            { label: 'VIN #', value: vehicle.subtitle || '-' },
            { label: 'Mileage', value: vehicle.mileage || '-' },
            { label: 'Title Status', value: formatTitleStatus(vehicle.titleStatus) },
            { label: 'Exterior Color', value: exteriorColor },
            { label: 'Interior Color', value: interiorColor },
            { label: 'Leather / Cloth', value: leatherCloth },
            { label: 'Roof', value: roof },
            { label: 'Drivetrain', value: drivetrain },
            { label: 'Transmission', value: transmission },
            { label: 'Engine', value: engine },
            { label: 'Accident History', value: accidentHistory },
            { label: 'Additional Disclosures', value: additionalDisclosures },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</div>
              <div className="text-sm font-medium text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
