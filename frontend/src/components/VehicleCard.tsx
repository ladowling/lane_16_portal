import { Button, Card, Space, Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';
import { VehiclePhoto } from './VehiclePhoto';

const { Text, Title } = Typography;

type VehicleCardProps = {
  vehicle: Vehicle;
  onSelect: (vehicleId: string) => void;
};

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  return (
    <Card
      className="vehicle-card"
      cover={<VehiclePhoto variant={vehicle.heroVariant} />}
      bordered
      hoverable
      onClick={() => onSelect(vehicle.id)}
    >
      <div className="vehicle-card-title-row">
        <Title level={3}>{vehicle.title}</Title>
        <Text className="title-status">{vehicle.status}</Text>
      </div>

      <Text className="vehicle-subtitle">
        {vehicle.subtitle} <span className="meta-divider" /> {vehicle.mileage}
      </Text>

      <div className="bid-row">
        <Space size={8}>
          <ClockCircleOutlined />
          <Text>Highest Bid Price:</Text>
        </Space>
        <Text className="price-text">{vehicle.highestBid}</Text>
      </div>

      <div className="card-footer-row">
        <Space size={8}>
          <CalendarOutlined />
          <Text>{vehicle.endsIn}</Text>
        </Space>
        <Text strong>{vehicle.bidCount} Bids</Text>
        <Button
          type="primary"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(vehicle.id);
          }}
        >
          Place Bid
        </Button>
      </div>
    </Card>
  );
}
