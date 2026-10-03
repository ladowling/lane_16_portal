import { Divider, Typography } from 'antd';
import { formatTitleStatus, type Vehicle } from '../types';

const { Paragraph, Title } = Typography;

type ConditionReportContentProps = {
  vehicle: Vehicle;
};

// Condition notes as the seller submitted them
export const getConditionReportRows = (vehicle: Vehicle) =>
  [
    { area: 'EXTERIOR', note: vehicle.exteriorCondition },
    { area: 'INTERIOR', note: vehicle.interiorCondition },
    { area: 'MECHANICAL', note: vehicle.mechanicalCondition },
    { area: 'WARNING LIGHTS', note: vehicle.warningLights },
    { area: 'TIRES', note: vehicle.tireCondition },
    { area: 'INTERIOR ODOR', note: vehicle.interiorOdor },
  ].map((row) => ({ ...row, note: row.note || 'Not reported' }));

export const getVehicleDetailFields = (vehicle: Vehicle) =>
  [
    { label: 'Year', value: vehicle.year },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Trim', value: vehicle.trim },
    { label: 'VIN #', value: vehicle.vin },
    { label: 'Mileage', value: vehicle.mileage },
    { label: 'Title Status', value: formatTitleStatus(vehicle.titleStatus) },
    { label: 'Exterior Color', value: vehicle.exteriorColor },
    { label: 'Interior Color', value: vehicle.interiorColor },
    { label: 'Leather / Cloth', value: vehicle.leatherOrCloth },
    { label: 'Roof', value: vehicle.roof },
    { label: 'Drivetrain', value: vehicle.drivetrain },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Accident History', value: vehicle.accidentHistory },
    { label: 'Additional Disclosures', value: vehicle.additionalDisclosures },
  ].map((field) => ({ ...field, value: field.value || '-' }));

export function ConditionReportContent({ vehicle }: ConditionReportContentProps) {
  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      {/* Condition sections */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Condition report sections">
        {getConditionReportRows(vehicle).map((row) => (
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
          {getVehicleDetailFields(vehicle).map(({ label, value }) => (
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
