import { Button, Card, Space, Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CopyOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';

const { Text, Title } = Typography;

type VehicleCardProps = {
  vehicle: Vehicle;
  onSelect: (vehicleId: string) => void;
};

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  return (
    <Card
      className="overflow-hidden !rounded-xl !border-[#555555] !bg-[#0c0c0c] [&_.ant-card-body]:!px-[18px] [&_.ant-card-body]:!pb-5 [&_.ant-card-body]:!pt-[18px] [&_.ant-card-cover]:h-[214px] [&_.ant-card-cover]:overflow-hidden max-[620px]:[&_.ant-card-cover]:h-[190px]"
      cover={<img className="h-full w-full object-cover" src={vehicle.imageSrc} alt={vehicle.title} />}
      bordered
      hoverable
      onClick={() => onSelect(vehicle.id)}
    >
      <div className="flex items-start justify-between gap-3.5 max-[620px]:flex-col">
        <Title className="!m-0 !text-xl !font-bold !leading-tight !text-white" level={3}>{vehicle.title}</Title>
        <Text className="shrink-0 !text-xs !font-extrabold !text-[#b1f000]">{vehicle.status}</Text>
      </div>

      <Text className="mt-2 block !text-[15px] !text-[#c8c8c8]">
       <span className="mb-[-4px] ml-2 mr-2 inline-block h-[18px] w-px bg-[#9b9b9b]" /> {vehicle.mileage}
      </Text>
            <div className="mt-3 flex items-center justify-between gap-3.5 max-[620px]:items-start max-[620px]:flex-col">
        <Text className="!text-[15px] !text-[#c8c8c8]">VIN: {vehicle.subtitle}</Text>
        <Button
          className="!h-6 !min-w-[78px] !rounded-none !text-xs !font-bold !text-[#c8c8c8]"
          type="default"
          size="small"
          icon={<CopyOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            navigator.clipboard.writeText(vehicle.subtitle).catch(() => {
              /* ignore clipboard failures */
            });
          }}
        >
          Copy VIN
        </Button>
      </div>

      <div className="mt-[15px] flex items-center justify-between gap-3.5 max-[620px]:items-start max-[620px]:flex-col">
        <Space size={8}>
          <ClockCircleOutlined className="!text-[#cfcfcf]" />
          <Text className="!text-[15px] !text-[#c8c8c8]">Current Bid:</Text>
        </Space>
        <Text className="!font-extrabold !text-[#24d725]">{vehicle.highestBid}</Text>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3.5 max-[620px]:items-start max-[620px]:flex-col">
        <Space size={8}>
          <CalendarOutlined className="!text-[#cfcfcf]" />
          <Text className="!text-[15px] !text-[#c8c8c8]">{vehicle.endsIn}</Text>
        </Space>
        <Text className="!text-[15px] !text-[#c8c8c8]" strong>{vehicle.bidCount} Bids</Text>
        <Button
          className="!h-6 !min-w-[78px] !rounded-none !text-xs !font-bold"
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
