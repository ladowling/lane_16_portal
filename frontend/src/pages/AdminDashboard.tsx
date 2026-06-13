import { useMemo, useState } from 'react';
import { Button, Form, Input, Popconfirm, Select, Space, Tabs, Tag, Tooltip, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { DataTable } from './adminDashboard/components/DataTable';
import { DetailModal } from './adminDashboard/components/DetailModal';

const { Paragraph, Text, Title } = Typography;

type StaffRecord = {
  name: string;
  email: string;
  role: 'admin' | 'staff';
};

type VehicleRecord = {
  vehicleName: string;
  sellerName: string;
  sellerPhoneNo: string;
  sellerEmail: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  mileage: string;
  location: string;
  condition: string;
  minimumAcceptablePrice: string;
  uploads: string;
  status: string;
  auctionStatus: 'Active' | 'Closed';
  bids: string;
  highestBid: string;
  bidCount: number;
  auctionEndTime: string;
  winningBidderName: string;
  winningBidAmount: string;
  tireCondition: string;
  mechanicalCondition: string;
  interiorCondition: string;
  exteriorCondition: string;
  lastUpdatedBy: string;
  bidIncrementNo: string;
  trim: string;
  exteriorColor: string;
  interiorColor: string;
  smokerVehicle: string;
  reserveMet: string;
};

type BidRecord = {
  bidId: string;
  vehicleName: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  contactPerson: string;
  contactPhone: string;
  bidAmount: string;
  bidStatus: 'currentHighBid' | string;
  note: string;
  bidTimestamp: string;
};

type DealerRecord = {
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  dateRegistered: string;
  vehiclesBidUpon: string;
  bidAmount: string;
  bidStatus: string;
  dealerNote: string;
};

type ContactRecord = {
  name: string;
  phoneNo: string;
  email: string;
  message: string;
};

const staffSeed: StaffRecord[] = [
  { name: 'Maya Brooks', email: 'maya@lane16.com', role: 'admin' },
  { name: 'Daniel Cho', email: 'daniel@lane16.com', role: 'staff' },
  { name: 'Priya Nelson', email: 'priya@lane16.com', role: 'staff' },
];

const vehicleSeed: VehicleRecord[] = [
  {
    vehicleName: '2021 Mercedes-Benz GLE 350',
    sellerName: 'Angela Morris',
    sellerPhoneNo: '(214) 555-0148',
    sellerEmail: 'angela.morris@example.com',
    vin: '4JGFB4KB5MA456812',
    year: 2021,
    make: 'Mercedes-Benz',
    model: 'GLE 350',
    mileage: '42,180',
    location: 'Dallas, TX',
    condition: 'Excellent',
    minimumAcceptablePrice: '$38,500',
    uploads: '31 photos, title scan, service record',
    status: 'Approved',
    auctionStatus: 'Active',
    bids: 'BID-1042, BID-1045, BID-1048',
    highestBid: '$41,800',
    bidCount: 9,
    auctionEndTime: 'Jun 14, 2026 4:30 PM',
    winningBidderName: 'Pending',
    winningBidAmount: 'Pending',
    tireCondition: '70% tread remaining',
    mechanicalCondition: 'No warning lights',
    interiorCondition: 'Clean leather, minor wear',
    exteriorCondition: 'Small rear bumper scuff',
    lastUpdatedBy: 'Daniel Cho',
    bidIncrementNo: '$250',
    trim: '4MATIC',
    exteriorColor: 'Polar White',
    interiorColor: 'Macchiato Beige',
    smokerVehicle: 'No',
    reserveMet: 'Yes',
  },
  {
    vehicleName: '2020 Toyota Tacoma TRD Off-Road',
    sellerName: 'Brandon Lee',
    sellerPhoneNo: '(602) 555-0192',
    sellerEmail: 'brandon.lee@example.com',
    vin: '3TMCZ5AN2LM337719',
    year: 2020,
    make: 'Toyota',
    model: 'Tacoma',
    mileage: '58,940',
    location: 'Phoenix, AZ',
    condition: 'Very Good',
    minimumAcceptablePrice: '$29,750',
    uploads: '24 photos, payoff letter',
    status: 'Approved',
    auctionStatus: 'Active',
    bids: 'BID-1051, BID-1053',
    highestBid: '$30,500',
    bidCount: 5,
    auctionEndTime: 'Jun 15, 2026 1:00 PM',
    winningBidderName: 'Pending',
    winningBidAmount: 'Pending',
    tireCondition: 'New all-terrain tires',
    mechanicalCondition: 'Recent inspection passed',
    interiorCondition: 'Light seat bolster wear',
    exteriorCondition: 'Rock chips on hood',
    lastUpdatedBy: 'Priya Nelson',
    bidIncrementNo: '$200',
    trim: 'TRD Off-Road',
    exteriorColor: 'Cement Gray',
    interiorColor: 'Black',
    smokerVehicle: 'No',
    reserveMet: 'No',
  },
  {
    vehicleName: '2019 BMW X5 xDrive40i',
    sellerName: 'Chris Benton',
    sellerPhoneNo: '(312) 555-0163',
    sellerEmail: 'chris.benton@example.com',
    vin: '5UXCR6C55KLL22184',
    year: 2019,
    make: 'BMW',
    model: 'X5',
    mileage: '64,220',
    location: 'Chicago, IL',
    condition: 'Good',
    minimumAcceptablePrice: '$31,000',
    uploads: '27 photos, Carfax PDF',
    status: 'Closed',
    auctionStatus: 'Closed',
    bids: 'BID-1010, BID-1017, BID-1021',
    highestBid: '$32,900',
    bidCount: 7,
    auctionEndTime: 'Jun 10, 2026 6:00 PM',
    winningBidderName: 'Metro Auto Group',
    winningBidAmount: '$32,900',
    tireCondition: 'Front tires 50%, rear tires 60%',
    mechanicalCondition: 'Oil service due soon',
    interiorCondition: 'Clean, no odors',
    exteriorCondition: 'Door ding on passenger side',
    lastUpdatedBy: 'Maya Brooks',
    bidIncrementNo: '$250',
    trim: 'xDrive40i',
    exteriorColor: 'Carbon Black',
    interiorColor: 'Cognac',
    smokerVehicle: 'No',
    reserveMet: 'Yes',
  },
  {
    vehicleName: '2022 Ford F-150 Lariat',
    sellerName: 'Natalie Reyes',
    sellerPhoneNo: '(404) 555-0121',
    sellerEmail: 'natalie.reyes@example.com',
    vin: '1FTFW1E83NFA81230',
    year: 2022,
    make: 'Ford',
    model: 'F-150',
    mileage: '35,410',
    location: 'Atlanta, GA',
    condition: 'Excellent',
    minimumAcceptablePrice: '$44,000',
    uploads: '35 photos, window sticker, title scan',
    status: 'Approved',
    auctionStatus: 'Closed',
    bids: 'BID-1060, BID-1068',
    highestBid: '$45,250',
    bidCount: 4,
    auctionEndTime: 'Jun 11, 2026 5:15 PM',
    winningBidderName: 'Summit Ford Wholesale',
    winningBidAmount: '$45,250',
    tireCondition: '80% tread remaining',
    mechanicalCondition: 'No issues reported',
    interiorCondition: 'Excellent',
    exteriorCondition: 'Excellent',
    lastUpdatedBy: 'Daniel Cho',
    bidIncrementNo: '$250',
    trim: 'Lariat',
    exteriorColor: 'Atlas Blue',
    interiorColor: 'Black',
    smokerVehicle: 'No',
    reserveMet: 'Yes',
  },
];

const bidSeed: BidRecord[] = [
  {
    bidId: 'BID-1048',
    vehicleName: '2021 Mercedes-Benz GLE 350',
    dealerName: 'Crestline Motors',
    dealerEmail: 'buydesk@crestline.example',
    dealerPhone: '(972) 555-0110',
    contactPerson: 'Evan Ross',
    contactPhone: '(972) 555-0111',
    bidAmount: '$41,800',
    bidStatus: 'currentHighBid',
    note: 'Ready to schedule inspection within 24 hours.',
    bidTimestamp: 'Jun 12, 2026 10:42 AM',
  },
  {
    bidId: 'BID-1053',
    vehicleName: '2020 Toyota Tacoma TRD Off-Road',
    dealerName: 'Desert Valley Auto',
    dealerEmail: 'inventory@desertvalley.example',
    dealerPhone: '(480) 555-0135',
    contactPerson: 'Lena Ortiz',
    contactPhone: '(480) 555-0136',
    bidAmount: '$30,500',
    bidStatus: 'currentHighBid',
    note: 'Interested if payoff confirmation is current.',
    bidTimestamp: 'Jun 12, 2026 9:18 AM',
  },
  {
    bidId: 'BID-1021',
    vehicleName: '2019 BMW X5 xDrive40i',
    dealerName: 'Metro Auto Group',
    dealerEmail: 'wholesale@metroauto.example',
    dealerPhone: '(708) 555-0174',
    contactPerson: 'Sam Patel',
    contactPhone: '(708) 555-0175',
    bidAmount: '$32,900',
    bidStatus: 'won',
    note: 'Final verification scheduled with seller.',
    bidTimestamp: 'Jun 10, 2026 5:58 PM',
  },
  {
    bidId: 'BID-1060',
    vehicleName: '2022 Ford F-150 Lariat',
    dealerName: 'Summit Ford Wholesale',
    dealerEmail: 'lane16@summitford.example',
    dealerPhone: '(470) 555-0188',
    contactPerson: 'Morgan Hale',
    contactPhone: '(470) 555-0189',
    bidAmount: '$44,750',
    bidStatus: 'outbid',
    note: 'Can increase if reserve remains unmet.',
    bidTimestamp: 'Jun 11, 2026 2:24 PM',
  },
];

const dealerSeed: DealerRecord[] = [
  {
    dealerName: 'Crestline Motors',
    dealerEmail: 'buydesk@crestline.example',
    dealerPhone: '(972) 555-0110',
    dateRegistered: 'May 18, 2026',
    vehiclesBidUpon: 'Mercedes-Benz GLE 350, Ford F-150',
    bidAmount: '$41,800',
    bidStatus: 'Current High Bid',
    dealerNote: 'High close rate and fast inspection scheduling.',
  },
  {
    dealerName: 'Desert Valley Auto',
    dealerEmail: 'inventory@desertvalley.example',
    dealerPhone: '(480) 555-0135',
    dateRegistered: 'May 21, 2026',
    vehiclesBidUpon: 'Toyota Tacoma',
    bidAmount: '$30,500',
    bidStatus: 'Current High Bid',
    dealerNote: 'Prefers trucks and Southwest inventory.',
  },
  {
    dealerName: 'Metro Auto Group',
    dealerEmail: 'wholesale@metroauto.example',
    dealerPhone: '(708) 555-0174',
    dateRegistered: 'May 24, 2026',
    vehiclesBidUpon: 'BMW X5, Mercedes-Benz GLE 350',
    bidAmount: '$32,900',
    bidStatus: 'Won',
    dealerNote: 'Needs title scans before final pickup.',
  },
  {
    dealerName: 'Summit Ford Wholesale',
    dealerEmail: 'lane16@summitford.example',
    dealerPhone: '(470) 555-0188',
    dateRegistered: 'Jun 2, 2026',
    vehiclesBidUpon: 'Ford F-150',
    bidAmount: '$45,250',
    bidStatus: 'Won',
    dealerNote: 'Ford franchise partner with quick payment approval.',
  },
];

const contactSeed: ContactRecord[] = [
  {
    name: 'Elaine Foster',
    phoneNo: '(214) 555-0168',
    email: 'elaine.foster@example.com',
    message: 'I submitted my vehicle yesterday and want to confirm whether additional interior photos are needed before review.',
  },
  {
    name: 'Marcus Green',
    phoneNo: '(602) 555-0107',
    email: 'marcus.green@example.com',
    message: 'Our dealership is interested in joining Lane16. Please send the dealer onboarding requirements and approval timeline.',
  },
  {
    name: 'Tara Singh',
    phoneNo: '(404) 555-0181',
    email: 'tara.singh@example.com',
    message: 'Can I update the minimum acceptable price after my listing has already started receiving bids?',
  },
  {
    name: 'Owen Miller',
    phoneNo: '(312) 555-0150',
    email: 'owen.miller@example.com',
    message: 'I have a payoff letter that expires soon and need to know where to upload the updated document.',
  },
];

const statusTagColor = {
  Active: 'green',
  Closed: 'red',
} as const;

const bidStatusLabel = (status: string) =>
  status === 'currentHighBid'
    ? 'Current High Bid'
    : status.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase());

export function AdminDashboard() {
  const [staff, setStaff] = useState<StaffRecord[]>(staffSeed);
  const [editingStaffEmail, setEditingStaffEmail] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [selectedBid, setSelectedBid] = useState<BidRecord | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<DealerRecord | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [form] = Form.useForm<StaffRecord>();

  const saveStaff = (values: StaffRecord) => {
    setStaff((currentStaff) => {
      if (editingStaffEmail) {
        return currentStaff.map((member) => (member.email === editingStaffEmail ? values : member));
      }

      return [...currentStaff, values];
    });
    setEditingStaffEmail(null);
    form.resetFields();
  };

  const startStaffEdit = (record: StaffRecord) => {
    setEditingStaffEmail(record.email);
    form.setFieldsValue(record);
  };

  const staffColumns: TableColumnsType<StaffRecord> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: StaffRecord['role']) => <Tag color={role === 'admin' ? 'green' : 'blue'}>{role.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => startStaffEdit(record)} size="small" type="primary">
            Edit
          </Button>
          <Popconfirm
            okText="Remove"
            okButtonProps={{ danger: true }}
            onConfirm={() => setStaff((currentStaff) => currentStaff.filter((member) => member.email !== record.email))}
            title="Remove this staff member?"
          >
            <Button danger size="small">
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const vehicleColumns: TableColumnsType<VehicleRecord> = [
    { title: 'Vehicle Name', dataIndex: 'vehicleName' },
    { title: 'Seller Name', dataIndex: 'sellerName' },
    { title: 'Seller Phone', dataIndex: 'sellerPhoneNo' },
    { title: 'Seller Email', dataIndex: 'sellerEmail' },
    { title: 'Make', dataIndex: 'make' },
    { title: 'Model', dataIndex: 'model' },
    {
      title: 'Auction Status',
      dataIndex: 'auctionStatus',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Closed', value: 'Closed' },
      ],
      onFilter: (value, record) => record.auctionStatus === value,
      render: (status: VehicleRecord['auctionStatus']) => <Tag color={statusTagColor[status]}>{status}</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button onClick={() => setSelectedVehicle(record)} size="small" type="primary">
          View
        </Button>
      ),
    },
  ];

  const bidColumns: TableColumnsType<BidRecord> = [
    { title: 'Bid ID', dataIndex: 'bidId' },
    { title: 'Vehicle Name', dataIndex: 'vehicleName' },
    { title: 'Dealer Name', dataIndex: 'dealerName' },
    { title: 'Dealer Email', dataIndex: 'dealerEmail' },
    { title: 'Bid Amount', dataIndex: 'bidAmount' },
    {
      title: 'Bid Status',
      dataIndex: 'bidStatus',
      render: (status: string) => <Tag color={status === 'currentHighBid' ? 'green' : 'default'}>{bidStatusLabel(status)}</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button onClick={() => setSelectedBid(record)} size="small" type="primary">
          View
        </Button>
      ),
    },
  ];

  const dealerColumns: TableColumnsType<DealerRecord> = [
    { title: 'Dealer Name', dataIndex: 'dealerName' },
    { title: 'Dealer Email', dataIndex: 'dealerEmail' },
    { title: 'Dealer Phone', dataIndex: 'dealerPhone' },
    { title: 'Date Registered', dataIndex: 'dateRegistered' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button onClick={() => setSelectedDealer(record)} size="small" type="primary">
          View
        </Button>
      ),
    },
  ];

  const contactColumns: TableColumnsType<ContactRecord> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Phone', dataIndex: 'phoneNo' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Message',
      dataIndex: 'message',
      render: (message: string) => (
        <Tooltip title={message}>
          <span>{message.length > 60 ? `${message.slice(0, 60)}...` : message}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button onClick={() => setSelectedContact(record)} size="small" type="primary">
          View
        </Button>
      ),
    },
  ];

  const vehicleSections = useMemo(
    () =>
      selectedVehicle
        ? [
            {
              heading: 'Vehicle Info',
              fields: [
                { label: 'VIN', value: selectedVehicle.vin },
                { label: 'Year', value: selectedVehicle.year },
                { label: 'Make', value: selectedVehicle.make },
                { label: 'Model', value: selectedVehicle.model },
                { label: 'Trim', value: selectedVehicle.trim },
                { label: 'Mileage', value: selectedVehicle.mileage },
                { label: 'Location', value: selectedVehicle.location },
                { label: 'Exterior Color', value: selectedVehicle.exteriorColor },
                { label: 'Interior Color', value: selectedVehicle.interiorColor },
                { label: 'Condition', value: selectedVehicle.condition },
                { label: 'Minimum Acceptable Price', value: selectedVehicle.minimumAcceptablePrice },
                { label: 'Smoker Vehicle', value: selectedVehicle.smokerVehicle },
                { label: 'Reserve Met', value: selectedVehicle.reserveMet },
                { label: 'Bid Increment', value: selectedVehicle.bidIncrementNo },
                { label: 'Uploads', value: selectedVehicle.uploads },
              ],
            },
            {
              heading: 'Auction & Bid Info',
              fields: [
                { label: 'Status', value: selectedVehicle.status },
                { label: 'Auction Status', value: <Tag color={statusTagColor[selectedVehicle.auctionStatus]}>{selectedVehicle.auctionStatus}</Tag> },
                { label: 'Auction End Time', value: selectedVehicle.auctionEndTime },
                { label: 'Bid Count', value: selectedVehicle.bidCount },
                { label: 'Bids', value: selectedVehicle.bids },
                { label: 'Highest Bid', value: selectedVehicle.highestBid },
                { label: 'Winning Bidder Name', value: selectedVehicle.winningBidderName },
                { label: 'Winning Bid Amount', value: selectedVehicle.winningBidAmount },
                { label: 'Tire Condition', value: selectedVehicle.tireCondition },
                { label: 'Mechanical Condition', value: selectedVehicle.mechanicalCondition },
                { label: 'Interior Condition', value: selectedVehicle.interiorCondition },
                { label: 'Exterior Condition', value: selectedVehicle.exteriorCondition },
                { label: 'Last Updated By', value: selectedVehicle.lastUpdatedBy },
              ],
            },
          ]
        : [],
    [selectedVehicle]
  );

  const tabs = [
    {
      key: 'staff',
      label: 'Staff',
      children: (
        <div className="space-y-6">
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-6">
            <Title className="!mb-5 !mt-0 !text-2xl !text-white" level={2}>
              {editingStaffEmail ? 'Edit Staff Member' : 'Onboard Staff'}
            </Title>
            <Form form={form} layout="vertical" onFinish={saveStaff} className="[&_.ant-form-item-label>label]:!text-white [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white [&_.ant-select-selector]:!border-[#575757] [&_.ant-select-selector]:!bg-[#242424] [&_.ant-select-selection-item]:!text-white">
              <div className="grid grid-cols-[1fr_1fr_220px_auto] gap-4 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Enter a name' }]}>
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Enter an email' }, { type: 'email', message: 'Enter a valid email' }]}>
                  <Input placeholder="staff@lane16.com" />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Choose a role' }]}>
                  <Select
                    options={[
                      { label: 'Admin', value: 'admin' },
                      { label: 'Staff', value: 'staff' },
                    ]}
                    placeholder="Select role"
                  />
                </Form.Item>
                <Form.Item label=" " className="max-[620px]:!mb-0">
                  <Space>
                    <Button htmlType="submit" type="primary">
                      {editingStaffEmail ? 'Save' : 'Add'}
                    </Button>
                    {editingStaffEmail && (
                      <Button
                        onClick={() => {
                          setEditingStaffEmail(null);
                          form.resetFields();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Space>
                </Form.Item>
              </div>
            </Form>
          </section>
          <DataTable columns={staffColumns} dataSource={staff} rowKey="email" searchable searchPlaceholder="Search staff" />
        </div>
      ),
    },
    {
      key: 'vehicles',
      label: 'Vehicles',
      children: <DataTable columns={vehicleColumns} dataSource={vehicleSeed} rowKey="vin" searchable searchPlaceholder="Search vehicles" />,
    },
    {
      key: 'bids',
      label: 'Bids',
      children: <DataTable columns={bidColumns} dataSource={bidSeed} rowKey="bidId" searchable searchPlaceholder="Search bids" />,
    },
    {
      key: 'dealers',
      label: 'Dealers',
      children: <DataTable columns={dealerColumns} dataSource={dealerSeed} rowKey="dealerEmail" searchable searchPlaceholder="Search dealers" />,
    },
    {
      key: 'contacts',
      label: 'Contacts',
      children: <DataTable columns={contactColumns} dataSource={contactSeed} rowKey={(record) => `${record.email}-${record.phoneNo}`} />,
    },
  ];

  return (
    <main className="min-h-screen bg-lane-ink px-10 pb-16 pt-8 text-white max-[720px]:px-4">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-end justify-between gap-4 max-[720px]:items-start max-[720px]:flex-col">
          <div>
            <Text className="!font-bold !uppercase !text-[#24d725]">Lane16 Admin</Text>
            <Title className="!mb-0 !mt-2 !text-4xl !text-white" level={1}>
              Dashboard
            </Title>
          </div>
          <Paragraph className="!mb-0 max-w-xl !text-right !text-[#c8c8c8] max-[720px]:!text-left">
            Manage staff, submitted vehicles, dealer bids, registered dealers, and inbound contact requests.
          </Paragraph>
        </div>

        <Tabs
          defaultActiveKey="staff"
          items={tabs}
          tabPosition="left"
          className="[&_.ant-tabs-content-holder]:!border-[#575757] [&_.ant-tabs-nav]:!before:border-[#575757] [&_.ant-tabs-tab]:!text-[#c8c8c8] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#24d725] [&_.ant-tabs-tab-btn]:!text-base [&_.ant-tabs-tab-btn]:!font-bold [&_.ant-tabs-tabpane]:!pl-8 max-[900px]:[&_.ant-tabs-tabpane]:!pl-0"
        />
      </div>

      <DetailModal open={Boolean(selectedVehicle)} onClose={() => setSelectedVehicle(null)} title={selectedVehicle?.vehicleName ?? 'Vehicle Details'} sections={vehicleSections} />
      <DetailModal
        open={Boolean(selectedBid)}
        onClose={() => setSelectedBid(null)}
        title={selectedBid?.bidId ?? 'Bid Details'}
        sections={
          selectedBid
            ? [
                {
                  heading: 'Bid Details',
                  fields: [
                    { label: 'Bid ID', value: selectedBid.bidId },
                    { label: 'Vehicle Name', value: selectedBid.vehicleName },
                    { label: 'Dealer Name', value: selectedBid.dealerName },
                    { label: 'Dealer Email', value: selectedBid.dealerEmail },
                    { label: 'Dealer Phone', value: selectedBid.dealerPhone },
                    { label: 'Contact Person', value: selectedBid.contactPerson },
                    { label: 'Contact Phone', value: selectedBid.contactPhone },
                    { label: 'Bid Amount', value: selectedBid.bidAmount },
                    { label: 'Bid Status', value: <Tag color={selectedBid.bidStatus === 'currentHighBid' ? 'green' : 'default'}>{bidStatusLabel(selectedBid.bidStatus)}</Tag> },
                    { label: 'Note', value: selectedBid.note },
                    { label: 'Bid Timestamp', value: selectedBid.bidTimestamp },
                  ],
                },
              ]
            : []
        }
      />
      <DetailModal
        open={Boolean(selectedDealer)}
        onClose={() => setSelectedDealer(null)}
        title={selectedDealer?.dealerName ?? 'Dealer Details'}
        sections={
          selectedDealer
            ? [
                {
                  heading: 'Dealer Details',
                  fields: [
                    { label: 'Dealer Name', value: selectedDealer.dealerName },
                    { label: 'Dealer Email', value: selectedDealer.dealerEmail },
                    { label: 'Dealer Phone', value: selectedDealer.dealerPhone },
                    { label: 'Date Registered', value: selectedDealer.dateRegistered },
                    { label: 'Vehicles Bid Upon', value: selectedDealer.vehiclesBidUpon },
                    { label: 'Bid Amount', value: selectedDealer.bidAmount },
                    { label: 'Bid Status', value: selectedDealer.bidStatus },
                    { label: 'Dealer Note', value: selectedDealer.dealerNote },
                  ],
                },
              ]
            : []
        }
      />
      <DetailModal
        open={Boolean(selectedContact)}
        onClose={() => setSelectedContact(null)}
        title={selectedContact?.name ?? 'Contact Message'}
        sections={
          selectedContact
            ? [
                {
                  heading: 'Contact Submission',
                  fields: [
                    { label: 'Name', value: selectedContact.name },
                    { label: 'Phone', value: selectedContact.phoneNo },
                    { label: 'Email', value: selectedContact.email },
                    { label: 'Message', value: selectedContact.message },
                  ],
                },
              ]
            : []
        }
      />
    </main>
  );
}
