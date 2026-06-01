import { useMemo, useState } from 'react';
import { Col, Empty, Input, Row, Select, Typography } from 'antd';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';

const { Title } = Typography;

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

const toSelectOptions = (values: string[]) =>
  [...new Set(values.filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
    .map((value) => ({ label: value, value }));

type InventoryPageProps = {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicleId: string) => void;
};

export function InventoryPage({ vehicles, onVehicleSelect }: InventoryPageProps) {
  const [selectedMake, setSelectedMake] = useState<string>();
  const [selectedModel, setSelectedModel] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <main className="z--1 mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <Title className="!mb-[38px] !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[32px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Inventory</Title>

      <div className="mb-10 grid w-full grid-cols-[minmax(170px,1fr)_minmax(170px,1fr)_minmax(260px,2fr)] gap-4 max-[820px]:flex max-[820px]:flex-col">
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
      </div>

      {filteredVehicles.length === 0 && (
        <Empty
          className="rounded-lg border border-[#555555] bg-[#0c0c0c] py-12"
          description={<span className="text-white">No vehicles match your filters.</span>}
        />
      )}

      <Row gutter={[34, 34]}>
        {filteredVehicles.map((vehicle) => (
          <Col key={vehicle.id} xs={24} md={12} xl={8}>
            <VehicleCard vehicle={vehicle} onSelect={onVehicleSelect} />
          </Col>
        ))}
      </Row>
    </main>
  );
}
