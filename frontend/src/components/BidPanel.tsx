import { Button, Input, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';

const { Text, Title } = Typography;

type BidPanelProps = {
  vehicle: Vehicle;
};

export function BidPanel({ vehicle }: BidPanelProps) {
  return (
    <aside className="details-panel bid-panel">
      <Title level={2}>Bidding Details</Title>

      <div className="bid-detail-row">
        <Text>Current High Bid</Text>
        <strong>{vehicle.currentHighBid}</strong>
      </div>

      <div className="bid-detail-row">
        <Text>Next Minimum</Text>
        <strong>{vehicle.nextMinimumBid}</strong>
      </div>

      <div className="countdown-pill">
        <ClockCircleOutlined />
        <span>2:14:33 remaining</span>
      </div>

      <Input className="bid-input" placeholder="Click to enter bid" />

      <Button type="primary" size="large" block className="binding-button">
        Place Binding Bid
      </Button>

      <Text className="verification-copy">Binding bid w/24hr verification</Text>
    </aside>
  );
}
