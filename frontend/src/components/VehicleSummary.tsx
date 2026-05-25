import { Button, Typography } from 'antd';
import type { Vehicle } from '../types';

const { Paragraph, Text, Title } = Typography;

type VehicleSummaryProps = {
  vehicle: Vehicle;
};

export function VehicleSummary({ vehicle }: VehicleSummaryProps) {
  return (
    <section className="details-panel vehicle-summary-panel">
      <Title level={2}>{vehicle.detailsTitle}</Title>
      <Text className="spec-line">{vehicle.specs.join(' | ')}</Text>
      <Paragraph>{vehicle.description}</Paragraph>
      <div className="condition-pill">Overall Condition: {vehicle.condition}</div>
      <Button type="primary" className="report-button">
        View Condition Report
      </Button>
    </section>
  );
}
