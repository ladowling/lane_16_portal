import { useMemo, useState } from 'react';
import { Button, Col, Empty, Input, Row, Select, Segmented, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';

const { Text, Title } = Typography;

const getTitleParts = (title: string) => {
  const titleWithoutYear = title.replace(/^\d{4}\s+/, '').trim();
  const [make = '', ...modelParts] = titleWithoutYear.split(/\s+/);

  return {
    make,
    model: modelParts.join(' '),
  };
};

const getVehicleSearchText = (vehicle: Vehicle) => {
  const { make, model } = getTitleParts(vehicle.title);

  return [
    vehicle.title,
    make,
    model,
    vehicle.subtitle,
    vehicle.mileage,
    vehicle.status,
    vehicle.highestBid,
    vehicle.currentHighBid,
    vehicle.nextMinimumBid,
    vehicle.endsIn,
    vehicle.detailsTitle,
    vehicle.specs.join(' '),
    vehicle.description,
    vehicle.condition,
  ].join(' ').toLowerCase();
};

const toSelectOptions = (values: string[]) => [
  { label: 'All', value: '' },
  ...[...new Set(values.filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
    .map((value) => ({ label: value, value })),
];

type InventoryPageProps = {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicleId: string) => void;
};

export function InventoryPage({ vehicles, onVehicleSelect }: InventoryPageProps) {
  const [selectedMake, setSelectedMake] = useState<string>();
  const [selectedModel, setSelectedModel] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');

  const vehicleFilters = useMemo(
    () => vehicles.map((vehicle) => ({ vehicle, ...getTitleParts(vehicle.title) })),
    [vehicles]
  );

  const makeOptions = useMemo(
    () => toSelectOptions(vehicleFilters.map(({ make }) => make)),
    [vehicleFilters]
  );

  const modelOptions = useMemo(
    () => toSelectOptions(
      vehicleFilters
        .filter(({ make }) => !selectedMake || make === selectedMake)
        .map(({ model }) => model)
    ),
    [selectedMake, vehicleFilters]
  );

  const filteredVehicles = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return vehicleFilters
      .filter(({ make }) => !selectedMake || make === selectedMake)
      .filter(({ model }) => !selectedModel || model === selectedModel)
      .filter(({ vehicle }) => !normalizedSearchTerm || getVehicleSearchText(vehicle).includes(normalizedSearchTerm))
      .map(({ vehicle }) => vehicle);
  }, [searchTerm, selectedMake, selectedModel, vehicleFilters]);

  const vehicleColumns = useMemo<TableColumnsType<Vehicle>>(
    () => [
      {
        title: 'Vehicle',
        key: 'vehicle',
        width: 420,
        render: (_, vehicle) => (
          <div className="flex min-w-[380px] items-center gap-4">
            <img className="h-16 w-24 rounded-md object-cover" src={vehicle.imageSrc} alt={vehicle.title} />
            <div>
              <Text className="block !font-bold !text-white">{vehicle.title}</Text>
              <Text className="block !text-sm !text-[#c8c8c8]">VIN: {vehicle.subtitle}</Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Mileage',
        dataIndex: 'mileage',
        key: 'mileage',
        render: (mileage: string) => <Text className="!text-[#c8c8c8]">{mileage}</Text>,
      },
      {
        title: 'Title Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => <Text className="!font-bold !text-[#b1f000]">{status}</Text>,
      },
      {
        title: 'Current Bid',
        dataIndex: 'highestBid',
        key: 'highestBid',
        render: (highestBid: string) => <Text className="!font-extrabold !text-[#24d725]">{highestBid}</Text>,
      },
      {
        title: 'Ends In',
        dataIndex: 'endsIn',
        key: 'endsIn',
        render: (endsIn: string) => <Text className="!text-[#c8c8c8]">{endsIn}</Text>,
      },
      {
        title: 'Bids',
        dataIndex: 'bidCount',
        key: 'bidCount',
        render: (bidCount: number) => <Text className="!text-[#c8c8c8]">{bidCount}</Text>,
      },
      {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (_, vehicle) => (
          <Button className="!rounded-md !font-bold" type="primary" size="small" onClick={() => onVehicleSelect(vehicle.id)}>
            View
          </Button>
        ),
      },
    ],
    [onVehicleSelect]
  );

  return (
    <main className="z--1 mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <Title className="!mb-[38px] !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[32px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Inventory</Title>

      <div className="mb-10 grid w-full grid-cols-[minmax(170px,1fr)_minmax(170px,1fr)_minmax(260px,2fr)_auto] gap-4 max-[980px]:grid-cols-[minmax(170px,1fr)_minmax(170px,1fr)] max-[820px]:flex max-[820px]:flex-col">
        <Select
          allowClear
          className="w-full"
          onChange={(value) => {
            setSelectedMake(value);
            setSelectedModel(undefined);
          }}
          options={makeOptions}
          placeholder="Filter by make"
          size="large"
          value={selectedMake}
        />
        <Select
          allowClear
          className="w-full"
          onChange={setSelectedModel}
          options={modelOptions}
          placeholder="Filter by model"
          size="large"
          value={selectedModel}
        />

        <Input
          allowClear
          className="w-full"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search name, model, VIN, or details"
          size="large"
          value={searchTerm}
        />

        <Segmented
          className="!h-10 !bg-[#242424] !p-1 [&_.ant-segmented-item]:!text-[#c8c8c8] [&_.ant-segmented-item-selected]:!bg-[#24d725] [&_.ant-segmented-item-selected]:!text-black"
          onChange={(value) => setViewMode(value as 'gallery' | 'table')}
          options={[
            { label: 'Gallery', value: 'gallery' },
            { label: 'Table', value: 'table' },
          ]}
          value={viewMode}
        />
      </div>

      {filteredVehicles.length === 0 && (
        <Empty
          className="rounded-lg border border-[#555555] bg-[#0c0c0c] py-12"
          description={<span className="text-white">No vehicles match your filters.</span>}
        />
      )}

      {viewMode === 'gallery' ? (
        <Row gutter={[34, 34]}>
          {filteredVehicles.map((vehicle) => (
            <Col key={vehicle.id} xs={24} md={12} xl={8}>
              <VehicleCard vehicle={vehicle} onSelect={onVehicleSelect} />
            </Col>
          ))}
        </Row>
      ) : (
        <Table
          className="overflow-hidden rounded-lg border border-[#555555] bg-[#0c0c0c] [&_.ant-table]:!bg-[#0c0c0c] [&_.ant-table-cell]:!border-[#333333] [&_.ant-table-cell]:!bg-[#0c0c0c] [&_.ant-table-cell]:!text-white [&_.ant-table-thead>tr>th]:!bg-[#171717] [&_.ant-table-thead>tr>th]:!font-bold [&_.ant-table-thead>tr>th]:!text-white [&_.ant-table-tbody>tr:hover>td]:!bg-[#171717]"
          columns={vehicleColumns}
          dataSource={filteredVehicles}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="id"
          scroll={{ x: 980 }}
        />
      )}
    </main>
  );
}
