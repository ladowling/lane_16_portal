import { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Dropdown, Form, Input, Modal, Popconfirm, Select, Space, Tabs, Tag, Tooltip, Typography, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { DataTable } from './adminDashboard/components/DataTable';
import { DetailModal } from './adminDashboard/components/DetailModal';
import logo from '../assets/cars/lane16Logo.png';
import { useAuth } from '../Authontext';
import { createAdmin, createDealer, createStaff, fetchContacts, fetchDealers, fetchStaff, fetchVehicles } from '../api';

const { Paragraph, Text, Title } = Typography;

type StaffRecord = {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
};

type VehicleRecord = {
  id?: string;
  vehicleName: string;
  dateCreated: string;
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
  dateCreated: string;
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
  id?: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  dateCreated: string;
  dateRegistered: string;
  vehiclesBidUpon: string;
  bidAmount: string;
  bidStatus: string;
  dealerNote: string;
};

type ContactRecord = {
  id?: string;
  name: string;
  phoneNo: string;
  email: string;
  message: string;
};

type DashboardTabKey = 'staff' | 'vehicles' | 'bids' | 'dealers' | 'contacts';

const staffSeed: StaffRecord[] = [
  { name: 'Maya Brooks', email: 'maya@lane16.com', role: 'admin' },
  { name: 'Daniel Cho', email: 'daniel@lane16.com', role: 'staff' },
  { name: 'Priya Nelson', email: 'priya@lane16.com', role: 'staff' },
];

const vehicleSeed: VehicleRecord[] = [
  {
    vehicleName: '2021 Mercedes-Benz GLE 350',
    dateCreated: '2026-06-08',
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
    dateCreated: '2026-06-09',
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
    dateCreated: '2026-06-04',
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
    dateCreated: '2026-06-07',
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
    dateCreated: '2026-06-12',
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
    dateCreated: '2026-06-12',
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
    dateCreated: '2026-06-10',
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
    dateCreated: '2026-06-11',
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
    dateCreated: '2026-05-18',
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
    dateCreated: '2026-05-21',
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
    dateCreated: '2026-05-24',
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
    dateCreated: '2026-06-02',
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

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const formatDateLabel = (dateValue: string) => {
  const date = new Date(dateValue.includes('T') ? dateValue : `${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue || 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const normalizeDateString = (dateString: string | string[] | null) =>
  Array.isArray(dateString) ? dateString[0] ?? '' : dateString ?? '';

const getRecordValue = (record: Record<string, unknown>, keys: string[]) =>
  keys.map((key) => record[key]).find((value) => value !== undefined && value !== null);

const getStringValue = (record: Record<string, unknown>, keys: string[], fallback = '') =>
  String(getRecordValue(record, keys) ?? fallback);

const getNumberValue = (record: Record<string, unknown>, keys: string[], fallback = 0) => {
  const value = Number(getRecordValue(record, keys));
  return Number.isFinite(value) ? value : fallback;
};

const getBooleanLabel = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value ?? 'No');
};

const getDateValue = (record: Record<string, unknown>) => {
  const value = getStringValue(record, ['dateCreated', 'createdAt', 'created_at', 'dateRegistered'], getTodayDate());
  return value.includes('T') ? value.slice(0, 10) : value;
};

const getArrayPayload = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const arrayValue = getRecordValue(record, ['data', 'items', 'results', 'vehicles', 'staff', 'dealers', 'contacts']);
    return Array.isArray(arrayValue) ? arrayValue : [];
  }

  return [];
};

const getTemporaryPassword = (response: Record<string, unknown>, fallback?: string) =>
  getStringValue(response, ['temporaryPassword', 'tempPassword', 'password', 'generatedPassword'], fallback ?? '');

const generateTemporaryPassword = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `Lane16-${random}#1`;
};

const mapStaffRecord = (item: unknown): StaffRecord => {
  const record = (item ?? {}) as Record<string, unknown>;
  const isAdmin = Boolean(getRecordValue(record, ['isAdmin']));
  const role = getStringValue(record, ['role']).toUpperCase() === 'STAFF' && !isAdmin ? 'staff' : isAdmin ? 'admin' : 'staff';

  return {
    id: getStringValue(record, ['id', '_id']),
    name: getStringValue(record, ['name']),
    email: getStringValue(record, ['email']),
    role,
  };
};

const mapVehicleRecord = (item: unknown): VehicleRecord => {
  const record = (item ?? {}) as Record<string, unknown>;
  const auctionStatus = getStringValue(record, ['auctionStatus'], 'ACTIVE').toUpperCase() === 'CLOSED' ? 'Closed' : 'Active';
  const vehicleName =
    getStringValue(record, ['vehicleName']) ||
    `${getStringValue(record, ['year'])} ${getStringValue(record, ['make'])} ${getStringValue(record, ['model'])}`.trim();

  return {
    id: getStringValue(record, ['id', '_id']),
    vehicleName,
    dateCreated: getDateValue(record),
    sellerName: getStringValue(record, ['sellerName']),
    sellerPhoneNo: getStringValue(record, ['sellerPhoneNo', 'sellerPhone', 'phoneNumber']),
    sellerEmail: getStringValue(record, ['sellerEmail', 'email']),
    vin: getStringValue(record, ['vin']),
    year: getNumberValue(record, ['year']),
    make: getStringValue(record, ['make']),
    model: getStringValue(record, ['model']),
    mileage: getStringValue(record, ['mileage']),
    location: getStringValue(record, ['location']),
    condition: getStringValue(record, ['condition']),
    minimumAcceptablePrice: getStringValue(record, ['minimumAcceptablePrice']),
    uploads: Array.isArray(record.uploads) ? record.uploads.length ? `${record.uploads.length} upload(s)` : 'None' : getStringValue(record, ['uploads'], 'None'),
    status: getStringValue(record, ['status'], 'PENDING'),
    auctionStatus,
    bids: getStringValue(record, ['bids'], '0'),
    highestBid: getStringValue(record, ['highestBid'], '0'),
    bidCount: getNumberValue(record, ['bidCount']),
    auctionEndTime: getStringValue(record, ['auctionEndTime']),
    winningBidderName: getStringValue(record, ['winningBidderName']),
    winningBidAmount: getStringValue(record, ['winningBidAmount']),
    tireCondition: getStringValue(record, ['tireCondition']),
    mechanicalCondition: getStringValue(record, ['mechanicalCondition']),
    interiorCondition: getStringValue(record, ['interiorCondition']),
    exteriorCondition: getStringValue(record, ['exteriorCondition']),
    lastUpdatedBy: getStringValue(record, ['lastUpdatedBy']),
    bidIncrementNo: getStringValue(record, ['bidIncrementNo']),
    trim: getStringValue(record, ['trim']),
    exteriorColor: getStringValue(record, ['exteriorColor']),
    interiorColor: getStringValue(record, ['interiorColor']),
    smokerVehicle: getBooleanLabel(record.smokerVehicle),
    reserveMet: getBooleanLabel(record.reserveMet),
  };
};

const mapDealerRecord = (item: unknown): DealerRecord => {
  const record = (item ?? {}) as Record<string, unknown>;
  const dateCreated = getDateValue(record);

  return {
    id: getStringValue(record, ['id', '_id']),
    dealerName: getStringValue(record, ['dealerName', 'name']),
    dealerEmail: getStringValue(record, ['dealerEmail', 'email']),
    dealerPhone: getStringValue(record, ['dealerPhone', 'phoneNumber', 'phone']),
    dateCreated,
    dateRegistered: getStringValue(record, ['dateRegistered'], formatDateLabel(dateCreated)),
    vehiclesBidUpon: getStringValue(record, ['vehiclesBidUpon'], 'None yet'),
    bidAmount: getStringValue(record, ['bidAmount'], '$0'),
    bidStatus: getStringValue(record, ['bidStatus'], 'New'),
    dealerNote: getStringValue(record, ['dealerNote', 'note'], ''),
  };
};

const mapContactRecord = (item: unknown): ContactRecord => {
  const record = (item ?? {}) as Record<string, unknown>;

  return {
    id: getStringValue(record, ['id', '_id']),
    name: getStringValue(record, ['name']),
    phoneNo: getStringValue(record, ['phoneNo', 'phoneNumber', 'phone']),
    email: getStringValue(record, ['email']),
    message: getStringValue(record, ['message']),
  };
};

const exportRowsToExcel = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) {
    message.warning('There is no data to export.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  const tableRows = rows
    .map((row) => `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join('')}</tr>`)
    .join('');
  const worksheet = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join('')}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([worksheet], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  link.click();
  URL.revokeObjectURL(url);
};

export function AdminDashboard() {
  const { logout, token, user } = useAuth();
  const [staff, setStaff] = useState<StaffRecord[]>(staffSeed);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(vehicleSeed);
  const [dealers, setDealers] = useState<DealerRecord[]>(dealerSeed);
  const [contacts, setContacts] = useState<ContactRecord[]>(contactSeed);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(false);
  const [isDealersLoading, setIsDealersLoading] = useState(false);
  const [isContactsLoading, setIsContactsLoading] = useState(false);
  const [isStaffSaving, setIsStaffSaving] = useState(false);
  const [isDealerSaving, setIsDealerSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardTabKey>('staff');
  const [vehicleMakeFilter, setVehicleMakeFilter] = useState<string>();
  const [vehicleModelFilter, setVehicleModelFilter] = useState<string>();
  const [vehicleDateFilter, setVehicleDateFilter] = useState('');
  const [dealerDateFilter, setDealerDateFilter] = useState('');
  const [bidDateFilter, setBidDateFilter] = useState('');
  const [editingStaffEmail, setEditingStaffEmail] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [selectedBid, setSelectedBid] = useState<BidRecord | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<DealerRecord | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [temporaryPasswordMessage, setTemporaryPasswordMessage] = useState('');
  const [form] = Form.useForm<StaffRecord>();
  const [dealerForm] = Form.useForm<Pick<DealerRecord, 'dealerName' | 'dealerEmail' | 'dealerPhone'>>();

  const loadStaff = async () => {
    if (!token || user?.role !== 'admin') {
      return;
    }

    setIsStaffLoading(true);
    try {
      const response = await fetchStaff(token);
      setStaff(getArrayPayload(response).map(mapStaffRecord));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to load staff.');
    } finally {
      setIsStaffLoading(false);
    }
  };

  const loadVehicles = async () => {
    if (!token) {
      return;
    }

    setIsVehiclesLoading(true);
    try {
      const response = await fetchVehicles(token);
      setVehicles(getArrayPayload(response).map(mapVehicleRecord));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to load vehicles.');
    } finally {
      setIsVehiclesLoading(false);
    }
  };

  const loadDealers = async () => {
    if (!token) {
      return;
    }

    setIsDealersLoading(true);
    try {
      const response = await fetchDealers(token);
      setDealers(getArrayPayload(response).map(mapDealerRecord));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to load dealers.');
    } finally {
      setIsDealersLoading(false);
    }
  };

  const loadContacts = async () => {
    if (!token || user?.role !== 'admin') {
      return;
    }

    setIsContactsLoading(true);
    try {
      const response = await fetchContacts(token);
      setContacts(getArrayPayload(response).map(mapContactRecord));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to load contacts.');
    } finally {
      setIsContactsLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
    void loadVehicles();
    void loadDealers();
    void loadContacts();
  }, [token, user?.role]);

  const saveStaff = async (values: StaffRecord) => {
    if (!token) {
      message.error('You must be logged in to onboard staff.');
      return;
    }

    if (editingStaffEmail) {
      setStaff((currentStaff) => currentStaff.map((member) => (member.email === editingStaffEmail ? values : member)));
      setEditingStaffEmail(null);
      form.resetFields();
      return;
    }

    setIsStaffSaving(true);
    try {
      if (values.role === 'admin') {
        const temporaryPassword = generateTemporaryPassword();
        await createAdmin(token, { name: values.name, email: values.email, password: temporaryPassword });
        setTemporaryPasswordMessage(`Admin created. Temporary password: ${temporaryPassword}`);
      } else {
        const response = await createStaff(token, { name: values.name, email: values.email });
        const temporaryPassword = getTemporaryPassword(response);
        setTemporaryPasswordMessage(
          temporaryPassword ? `Staff created. Temporary password: ${temporaryPassword}` : 'Staff created successfully.'
        );
      }

      await loadStaff();
      form.resetFields();
      message.success(`${values.role === 'admin' ? 'Admin' : 'Staff'} onboarded successfully.`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to onboard staff.');
    } finally {
      setIsStaffSaving(false);
    }
  };

  const startStaffEdit = (record: StaffRecord) => {
    setEditingStaffEmail(record.email);
    form.setFieldsValue(record);
  };

  const saveDealer = async (values: Pick<DealerRecord, 'dealerName' | 'dealerEmail' | 'dealerPhone'>) => {
    if (!token) {
      message.error('You must be logged in to onboard dealers.');
      return;
    }

    setIsDealerSaving(true);
    try {
      const response = await createDealer(token, {
        name: values.dealerName,
        email: values.dealerEmail,
        phoneNumber: values.dealerPhone,
      });
      const temporaryPassword = getTemporaryPassword(response);
      setTemporaryPasswordMessage(
        temporaryPassword ? `Dealer created. Temporary password: ${temporaryPassword}` : 'Dealer created successfully.'
      );
      await loadDealers();
      dealerForm.resetFields();
      message.success('Dealer onboarded successfully.');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to onboard dealer.');
    } finally {
      setIsDealerSaving(false);
    }
  };

  const vehicleMakeOptions = useMemo(
    () => Array.from(new Set(vehicles.map((vehicle) => vehicle.make).filter(Boolean))).map((make) => ({ label: make, value: make })),
    [vehicles]
  );

  const vehicleModelOptions = useMemo(
    () => Array.from(new Set(vehicles.map((vehicle) => vehicle.model).filter(Boolean))).map((model) => ({ label: model, value: model })),
    [vehicles]
  );

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          (!vehicleMakeFilter || vehicle.make === vehicleMakeFilter) &&
          (!vehicleModelFilter || vehicle.model === vehicleModelFilter) &&
          (!vehicleDateFilter || vehicle.dateCreated === vehicleDateFilter)
      ),
    [vehicleDateFilter, vehicleMakeFilter, vehicleModelFilter, vehicles]
  );

  const filteredBids = useMemo(
    () => bidSeed.filter((bid) => !bidDateFilter || bid.dateCreated === bidDateFilter),
    [bidDateFilter]
  );

  const filteredDealers = useMemo(
    () => dealers.filter((dealer) => !dealerDateFilter || dealer.dateCreated === dealerDateFilter),
    [dealerDateFilter, dealers]
  );

  const dealerBidHistory = useMemo(
    () => bidSeed.filter((bid) => bid.dealerEmail === selectedDealer?.dealerEmail),
    [selectedDealer]
  );

  const handleLogout = () => {
    logout();
  };

  const handleResetPassword = () => {
    message.info('Change password flow is not connected yet.');
  };

  const accountName =
    user?.name ||
    staff.find((member) => member.email === user?.email)?.name ||
    user?.email?.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase()) ||
    'User Account';
  const accountRole = user?.role === 'admin' ? 'Admin' : 'Staff';
  const accountInitials = accountName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

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
    { title: 'Date Created', dataIndex: 'dateCreated', render: (dateCreated: string) => formatDateLabel(dateCreated) },
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
    { title: 'Date Created', dataIndex: 'dateCreated', render: (dateCreated: string) => formatDateLabel(dateCreated) },
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
    { title: 'Date Created', dataIndex: 'dateCreated', render: (dateCreated: string) => formatDateLabel(dateCreated) },
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
                    <Button htmlType="submit" loading={isStaffSaving} type="primary">
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
          <div className="flex justify-end">
            <Button className="!border-[#24d725] !bg-[#24d725] !font-bold !text-black hover:!border-[#24d725] hover:!bg-transparent hover:!text-[#24d725]" onClick={() => exportRowsToExcel('staff', staff)}>
              Export
            </Button>
          </div>
          <DataTable columns={staffColumns} dataSource={staff} loading={isStaffLoading} rowKey={(record) => record.id || record.email} searchable searchPlaceholder="Search staff" />
        </div>
      ),
    },
    {
      key: 'vehicles',
      label: 'Vehicle',
      children: (
        <div className="space-y-4">
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-4">
            <Space size={16} wrap>
              <Select
                allowClear
                className="min-w-[180px] [&_.ant-select-selector]:!border-[#575757] [&_.ant-select-selector]:!bg-[#242424] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-placeholder]:!text-[#a8a8a8]"
                onChange={setVehicleMakeFilter}
                options={vehicleMakeOptions}
                placeholder="Filter by make"
                value={vehicleMakeFilter}
              />
              <Select
                allowClear
                className="min-w-[180px] [&_.ant-select-selector]:!border-[#575757] [&_.ant-select-selector]:!bg-[#242424] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-placeholder]:!text-[#a8a8a8]"
                onChange={setVehicleModelFilter}
                options={vehicleModelOptions}
                placeholder="Filter by model"
                value={vehicleModelFilter}
              />
              <DatePicker
                allowClear
                className="!border-[#575757] !bg-[#242424] [&_.ant-picker-input_input]:!text-white [&_.ant-picker-input_input::placeholder]:!text-[#a8a8a8] [&_.ant-picker-suffix]:!text-[#c8c8c8]"
                onChange={(_, dateString) => setVehicleDateFilter(normalizeDateString(dateString))}
                placeholder="Filter by date created"
              />
              <Button
                onClick={() => {
                  setVehicleMakeFilter(undefined);
                  setVehicleModelFilter(undefined);
                  setVehicleDateFilter('');
                }}
              >
                Clear Filters
              </Button>
              <Button className="!border-[#24d725] !bg-[#24d725] !font-bold !text-black hover:!border-[#24d725] hover:!bg-transparent hover:!text-[#24d725]" onClick={() => exportRowsToExcel('vehicles', filteredVehicles)}>
                Export
              </Button>
            </Space>
          </section>
          <DataTable columns={vehicleColumns} dataSource={filteredVehicles} loading={isVehiclesLoading} rowKey={(record) => record.id || record.vin} searchable searchPlaceholder="Search vehicles" />
        </div>
      ),
    },
    {
      key: 'bids',
      label: 'Bids',
      children: (
        <div className="space-y-4">
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-4">
            <Space size={16} wrap>
              <DatePicker
                allowClear
                className="!border-[#575757] !bg-[#242424] [&_.ant-picker-input_input]:!text-white [&_.ant-picker-input_input::placeholder]:!text-[#a8a8a8] [&_.ant-picker-suffix]:!text-[#c8c8c8]"
                onChange={(_, dateString) => setBidDateFilter(normalizeDateString(dateString))}
                placeholder="Filter by date created"
              />
              <Button onClick={() => setBidDateFilter('')}>Clear Filter</Button>
              <Button className="!border-[#24d725] !bg-[#24d725] !font-bold !text-black hover:!border-[#24d725] hover:!bg-transparent hover:!text-[#24d725]" onClick={() => exportRowsToExcel('bids', filteredBids)}>
                Export
              </Button>
            </Space>
          </section>
          <DataTable columns={bidColumns} dataSource={filteredBids} rowKey="bidId" searchable searchPlaceholder="Search bids" />
        </div>
      ),
    },
    {
      key: 'dealers',
      label: 'Dealer',
      children: (
        <div className="space-y-6">
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-6">
            <Title className="!mb-5 !mt-0 !text-2xl !text-white" level={2}>
              Onboard Dealer
            </Title>
            <Form form={dealerForm} layout="vertical" onFinish={saveDealer} className="[&_.ant-form-item-label>label]:!text-white [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white">
              <div className="grid grid-cols-[1fr_1fr_220px_auto] gap-4 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
                <Form.Item label="Dealer Name" name="dealerName" rules={[{ required: true, message: 'Enter dealer name' }]}>
                  <Input placeholder="Dealer name" />
                </Form.Item>
                <Form.Item label="Dealer Email" name="dealerEmail" rules={[{ required: true, message: 'Enter dealer email' }, { type: 'email', message: 'Enter a valid email' }]}>
                  <Input placeholder="dealer@company.com" />
                </Form.Item>
                <Form.Item label="Phone No" name="dealerPhone" rules={[{ required: true, message: 'Enter phone number' }]}>
                  <Input placeholder="(555) 555-0123" />
                </Form.Item>
                <Form.Item label=" " className="max-[620px]:!mb-0">
                  <Button htmlType="submit" loading={isDealerSaving} type="primary">
                    Add Dealer
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </section>
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-4">
            <Space size={16} wrap>
              <DatePicker
                allowClear
                className="!border-[#575757] !bg-[#242424] [&_.ant-picker-input_input]:!text-white [&_.ant-picker-input_input::placeholder]:!text-[#a8a8a8] [&_.ant-picker-suffix]:!text-[#c8c8c8]"
                onChange={(_, dateString) => setDealerDateFilter(normalizeDateString(dateString))}
                placeholder="Filter by date created"
              />
              <Button onClick={() => setDealerDateFilter('')}>Clear Filter</Button>
              <Button className="!border-[#24d725] !bg-[#24d725] !font-bold !text-black hover:!border-[#24d725] hover:!bg-transparent hover:!text-[#24d725]" onClick={() => exportRowsToExcel('dealers', filteredDealers)}>
                Export
              </Button>
            </Space>
          </section>
          <DataTable columns={dealerColumns} dataSource={filteredDealers} loading={isDealersLoading} rowKey={(record) => record.id || record.dealerEmail} searchable searchPlaceholder="Search dealers" />
        </div>
      ),
    },
    {
      key: 'contacts',
      label: 'Contact',
      children: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="!border-[#24d725] !bg-[#24d725] !font-bold !text-black hover:!border-[#24d725] hover:!bg-transparent hover:!text-[#24d725]" onClick={() => exportRowsToExcel('contacts', contacts)}>
              Export
            </Button>
          </div>
          <DataTable columns={contactColumns} dataSource={contacts} loading={isContactsLoading} rowKey={(record) => record.id || `${record.email}-${record.phoneNo}`} />
        </div>
      ),
    },
  ];

  const dashboardMenuItems: { key: DashboardTabKey; label: string }[] = [
    { key: 'staff', label: 'Staff' },
    { key: 'vehicles', label: 'Vehicle' },
    { key: 'bids', label: 'Bids' },
    { key: 'dealers', label: 'Dealer' },
    { key: 'contacts', label: 'Contact' },
  ];

  return (
    <main className="min-h-screen bg-lane-ink text-white">
      <header className="sticky top-0 z-[1000] flex min-h-[92px] items-center justify-between gap-8 bg-black px-16 text-white max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-2 max-[980px]:px-6 max-[980px]:py-3.5">
        <img className="h-[120px] w-auto max-[980px]:h-16" src={logo} alt="Lane16 logo" />
        <div className="flex items-center gap-8 max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-4">
          <nav aria-label="Admin dashboard navigation">
            <Space size={28} className="max-[980px]:flex-wrap max-[620px]:!gap-3.5">
              {dashboardMenuItems.map((item) => {
                const isActive = activeSection === item.key;

                return (
                  <Button
                    className={`!h-auto !px-0 !py-1 !text-[18px] !font-bold hover:!bg-transparent max-[980px]:!text-lg ${
                      isActive ? '!text-[#24d725]' : '!text-white hover:!text-[#24d725]'
                    }`}
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    type="text"
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Space>
          </nav>
          <Dropdown
            menu={{
              items: [
                { key: 'change-password', label: 'Change Password', onClick: handleResetPassword },
                { key: 'logout', label: 'Log Out', danger: true, onClick: handleLogout },
              ],
            }}
            trigger={['click']}
          >
            <Button className="!h-auto !border !border-[#575757] !bg-black !px-3 !py-2 !text-left !shadow-none hover:!border-[#24d725] hover:!bg-black">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#123414] text-xs font-bold text-[#24d725]">
                  {accountInitials}
                </span>
                <span className="min-w-[130px]">
                  <span className="block text-sm font-bold leading-5 text-white">{accountName}</span>
                  <span className="block text-xs leading-4 text-[#c8c8c8]">{accountRole}</span>
                </span>
                <DownOutlined className="text-sm !text-[#24d725]" />
              </span>
            </Button>
          </Dropdown>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-10 pb-16 pt-8 max-[720px]:px-4">
        <div className="mb-8 flex items-end justify-between gap-4 max-[720px]:items-start max-[720px]:flex-col">
          <div>
            <Text className="!font-bold !uppercase !text-[#24d725]">Lane16 Admin</Text>
            <Title className="!mb-0 !mt-2 !text-4xl !text-white" level={1}>
              Admin Panel
            </Title>
          </div>
          <Paragraph className="!mb-0 max-w-xl !text-right !text-[#c8c8c8] max-[720px]:!text-left">
            Manage staff, submitted vehicles, dealer bids, registered dealers, and inbound contact requests.
          </Paragraph>
        </div>

        <Tabs
          activeKey={activeSection}
          items={tabs}
          onChange={(key) => setActiveSection(key as DashboardTabKey)}
          renderTabBar={() => <></>}
        />
      </div>

      <DetailModal open={Boolean(selectedVehicle)} onClose={() => setSelectedVehicle(null)} title={selectedVehicle?.vehicleName ?? 'Vehicle Details'} sections={vehicleSections} />
      <Modal
        centered
        okText="Close"
        onCancel={() => setTemporaryPasswordMessage('')}
        onOk={() => setTemporaryPasswordMessage('')}
        open={Boolean(temporaryPasswordMessage)}
        title="Onboarding Complete"
      >
        <Text>{temporaryPasswordMessage}</Text>
      </Modal>
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
      <Modal
        centered
        footer={null}
        onCancel={() => setSelectedDealer(null)}
        open={Boolean(selectedDealer)}
        title={<span className="text-white">{selectedDealer?.dealerName ?? 'Dealer Details'}</span>}
        width={980}
        className="[&_.ant-modal-close]:!text-white [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
      >
        {selectedDealer && (
          <Tabs
            defaultActiveKey="dealer-details"
            className="[&_.ant-tabs-nav]:!before:border-[#575757] [&_.ant-tabs-tab]:!text-[#c8c8c8] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#24d725]"
            items={[
              {
                key: 'dealer-details',
                label: 'Dealer Details',
                children: (
                  <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                    {[
                      { label: 'Dealer Name', value: selectedDealer.dealerName },
                      { label: 'Dealer Email', value: selectedDealer.dealerEmail },
                      { label: 'Dealer Phone', value: selectedDealer.dealerPhone },
                      { label: 'Date Created', value: formatDateLabel(selectedDealer.dateCreated) },
                      { label: 'Date Registered', value: selectedDealer.dateRegistered },
                      { label: 'Dealer Note', value: selectedDealer.dealerNote },
                    ].map((field) => (
                      <div className="rounded-lg border border-[#575757] bg-[#111111] p-4" key={field.label}>
                        <Text className="block !text-xs !font-bold !uppercase !text-[#a8a8a8]">
                          {field.label}
                        </Text>
                        <div className="mt-2 break-words text-base text-white">{field.value}</div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'bid-history',
                label: 'Bid History',
                children: (
                  <DataTable
                    columns={bidColumns}
                    dataSource={dealerBidHistory}
                    rowKey="bidId"
                    searchable
                    searchPlaceholder="Search bid history"
                  />
                ),
              },
            ]}
          />
        )}
      </Modal>
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
