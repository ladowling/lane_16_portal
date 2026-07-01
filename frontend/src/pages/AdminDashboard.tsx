import { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Dropdown, Form, Image, Input, Modal, Popconfirm, Select, Space, Tabs, Tag, Tooltip, Typography, message } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { DataTable } from './adminDashboard/components/DataTable';
import { DetailModal } from './adminDashboard/components/DetailModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import logo from '../assets/cars/lane16Logo.png';
import { useAuth } from '../Authontext';
import { approveVehicle, createAdmin, createBuyer, createStaff, fetchBuyers, fetchContacts, fetchStaff, fetchVehicles, fetchVehicleBids, getUploadUrl, updateBuyer, updateStaff, updateVehicleValuation } from '../api';

const { Paragraph, Text, Title } = Typography;

type StaffRecord = {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  lastModifiedBy?: string | null;
  lastModifiedAt?: string | null;
  createdAt?: string | null;
};

type VehicleUpload = {
  id: string;
  name: string;
  url: string;
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
  uploadItems: VehicleUpload[];
  status: string;
  auctionStatus: 'Active' | 'Closed';
  bids: string;
  highestBid: string;
  bidCount: number;
  auctionStartTime: string;
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
  kbbTradeInValue?: number;
  kbbPrivatePartyValue?: number;
  mmrValue?: number;
  carMaxOffer?: number;
  carvanaOffer?: number;
  acvWholesaleEstimate?: number;
  finalTransactionPrice?: number | null;
  reasonNotSold?: string | null;
  adminValuationNotes?: string | null;
};

type BidRecord = {
  bidId: string;
  vehicleId: string;
  dealerId: string;
  dateCreated: string;
  vehicleName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  contactPerson: string;
  contactPhone: string;
  bidAmount: string;
  bidStatus: 'currentHighBid' | string;
  note: string;
  bidTimestamp: string;
  dealershipName?: string;
  dealershipAddress?: string;
};

type DealerRecord = {
  id?: string;
  dealerName: string;       // buyer's name
  dealerEmail: string;      // buyer's email
  dealerPhone: string;      // buyer's phone
  dealershipName: string;   // default dealership name
  dealershipAddress: string; // default dealership address
  dateCreated: string;
  vehiclesBidUpon: string;
  bidAmount: string;
  bidStatus: string;
  dealerNote: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
};

type ContactRecord = {
  id?: string;
  name: string;
  phoneNo: string;
  email: string;
  message: string;
};

type DashboardTabKey = 'staff' | 'vehicles' | 'bids' | 'dealers' | 'contacts';

type VehicleApprovalForm = {
  auctionStartTime: { toISOString: () => string };
  auctionEndTime: { toISOString: () => string };
};

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
    uploadItems: [],
    status: 'Approved',
    auctionStatus: 'Active',
    bids: 'BID-1042, BID-1045, BID-1048',
    highestBid: '$41,800',
    bidCount: 9,
    auctionStartTime: 'Jun 12, 2026 4:30 PM',
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
    uploadItems: [],
    status: 'Approved',
    auctionStatus: 'Active',
    bids: 'BID-1051, BID-1053',
    highestBid: '$30,500',
    bidCount: 5,
    auctionStartTime: 'Jun 12, 2026 1:00 PM',
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
    uploadItems: [],
    status: 'Closed',
    auctionStatus: 'Closed',
    bids: 'BID-1010, BID-1017, BID-1021',
    highestBid: '$32,900',
    bidCount: 7,
    auctionStartTime: 'Jun 8, 2026 6:00 PM',
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
    uploadItems: [],
    status: 'Approved',
    auctionStatus: 'Closed',
    bids: 'BID-1060, BID-1068',
    highestBid: '$45,250',
    bidCount: 4,
    auctionStartTime: 'Jun 9, 2026 5:15 PM',
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

const approvalStatusColor: Record<string, string> = {
  PENDING: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
  BIDDING_ACTIVE: 'cyan',
  BIDDING_ENDED: 'default',
  SOLD: 'purple',
  AVAILABLE: 'blue',
};

const renderApprovalStatusTag = (status: string) => {
  const normalizedStatus = status.toUpperCase();
  return <Tag color={approvalStatusColor[normalizedStatus] || 'default'}>{normalizedStatus.replace(/_/g, ' ')}</Tag>;
};

const bidStatusLabel = (status: string) => {
  if (!status) return '';
  const normalized = status.toUpperCase().replace(/_/g, '');
  if (normalized === 'CURRENTHIGHBID') return 'Current High Bid';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const formatCurrency = (value: string | number) => {
  if (!value) return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return typeof value === 'string' ? value : String(value);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
};

const formatShortBidId = (id: string) => {
  if (!id) return '';
  if (id.startsWith('BID-') || id.match(/^\d{4}-/)) return id;
  const year = new Date().getFullYear();
  const shortPart = id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
  return `${year}-${shortPart}`;
};

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

const mapVehicleUpload = (upload: unknown, index: number): VehicleUpload | null => {
  if (typeof upload === 'string') {
    return { id: upload, name: `Upload ${index + 1}`, url: getUploadUrl(upload) };
  }

  if (!upload || typeof upload !== 'object') {
    return null;
  }

  const record = upload as Record<string, unknown>;
  const id = getStringValue(record, ['id', '_id', 'uploadId']);
  const url = getStringValue(record, ['url', 'src', 'path'], id ? getUploadUrl(id) : '');

  if (!url) {
    return null;
  }

  return {
    id: id || url,
    name: getStringValue(record, ['name', 'fileName', 'filename', 'originalName'], `Upload ${index + 1}`),
    url,
  };
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
    lastModifiedBy: getStringValue(record, ['lastModifiedBy']),
    lastModifiedAt: getStringValue(record, ['lastModifiedAt']),
    createdAt: getStringValue(record, ['createdAt', 'dateCreated']),
  };
};

const mapVehicleRecord = (item: unknown): VehicleRecord => {
  const record = (item ?? {}) as Record<string, unknown>;
  const auctionStatus = getStringValue(record, ['auctionStatus'], 'ACTIVE').toUpperCase() === 'CLOSED' ? 'Closed' : 'Active';
  const vehicleName =
    getStringValue(record, ['vehicleName']) ||
    `${getStringValue(record, ['year'])} ${getStringValue(record, ['make'])} ${getStringValue(record, ['model'])}`.trim();
  const uploadItems = Array.isArray(record.uploads)
    ? record.uploads.map(mapVehicleUpload).filter((upload): upload is VehicleUpload => Boolean(upload))
    : [];

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
    minimumAcceptablePrice: formatCurrency(getStringValue(record, ['minimumAcceptablePrice'])),
    uploads: uploadItems.length ? `${uploadItems.length} upload(s)` : getStringValue(record, ['uploads'], 'None'),
    uploadItems,
    status: getStringValue(record, ['status'], 'PENDING'),
    auctionStatus,
    bids: getStringValue(record, ['bids'], '0'),
    highestBid: getStringValue(record, ['highestBid'], '0'),
    bidCount: getNumberValue(record, ['bidCount']),
    auctionStartTime: getStringValue(record, ['auctionStartTime', 'auctionStartAt', 'auctionStartedAt', 'createdAt']),
    auctionEndTime: getStringValue(record, ['auctionEndTime']),
    winningBidderName: getStringValue(record, ['winningBidderName']),
    winningBidAmount: formatCurrency(getStringValue(record, ['winningBidAmount'])),
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
    kbbTradeInValue: getNumberValue(record, ['kbbTradeInValue']),
    kbbPrivatePartyValue: getNumberValue(record, ['kbbPrivatePartyValue']),
    mmrValue: getNumberValue(record, ['mmrValue']),
    carMaxOffer: getNumberValue(record, ['carMaxOffer']),
    carvanaOffer: getNumberValue(record, ['carvanaOffer']),
    acvWholesaleEstimate: getNumberValue(record, ['acvWholesaleEstimate']),
    finalTransactionPrice: getNumberValue(record, ['finalTransactionPrice']) || null,
    reasonNotSold: getStringValue(record, ['reasonNotSold']) || null,
    adminValuationNotes: getStringValue(record, ['adminValuationNotes']) || null,
  };
};

const mapDealerRecord = (item: unknown): DealerRecord => {
  const record = (item ?? {}) as Record<string, unknown>;
  const dateCreated = getDateValue(record);
  // Buyers may have a dealerships array; pick the first one as the default
  const dealerships = Array.isArray(record.dealerships) ? record.dealerships as Record<string, unknown>[] : [];
  const defaultDealership = dealerships[0] ?? {};

  return {
    id: getStringValue(record, ['id', '_id']),
    dealerName: getStringValue(record, ['dealerName', 'name']),
    dealerEmail: getStringValue(record, ['dealerEmail', 'email']),
    dealerPhone: getStringValue(record, ['dealerPhone', 'phoneNumber', 'phone']),
    dealershipName: getStringValue(defaultDealership as Record<string, unknown>, ['name'], 'N/A'),
    dealershipAddress: getStringValue(defaultDealership as Record<string, unknown>, ['address'], 'N/A'),
    dateCreated,
    vehiclesBidUpon: getStringValue(record, ['vehiclesBidUpon'], 'None yet'),
    bidAmount: formatCurrency(getStringValue(record, ['bidAmount'])),
    bidStatus: getStringValue(record, ['bidStatus']),
    dealerNote: getStringValue(record, ['dealerNote', 'note']),
    lastModifiedBy: getStringValue(record, ['lastModifiedBy'], '-'),
    lastModifiedAt: getStringValue(record, ['lastModifiedAt']),
  };
};

const mapBidRecord = (item: unknown, vehicles: VehicleRecord[] = [], dealers: DealerRecord[] = []): BidRecord => {
  const record = (item ?? {}) as Record<string, unknown>;
  const dateCreated = getDateValue(record);
  
  const vehicleId = getStringValue(record, ['vehicleId', 'vehicle']);
  const dealerId = getStringValue(record, ['buyerId', 'dealerId', 'dealer']);
  
  const matchedVehicle = vehicles.find(v => v.id === vehicleId);
  const matchedDealer = dealers.find(d => d.id === dealerId);

  return {
    bidId: formatShortBidId(getStringValue(record, ['id', 'bidId'])),
    vehicleId,
    dealerId,
    dateCreated,
    vehicleName: matchedVehicle?.vehicleName || getStringValue((record.vehicle ?? {}) as Record<string, unknown>, ['vehicleName']) || getStringValue(record, ['vehicleName']),
    buyerName: getStringValue((record.buyer ?? {}) as Record<string, unknown>, ['name']) || matchedDealer?.dealerName || getStringValue(record, ['buyerName', 'dealerName']),
    buyerEmail: getStringValue((record.buyer ?? {}) as Record<string, unknown>, ['email']) || matchedDealer?.dealerEmail || getStringValue(record, ['buyerEmail', 'dealerEmail', 'email']),
    buyerPhone: getStringValue((record.buyer ?? {}) as Record<string, unknown>, ['phoneNumber', 'phone']) || matchedDealer?.dealerPhone || getStringValue(record, ['buyerPhone', 'dealerPhone', 'phone']),
    contactPerson: getStringValue(record, ['contactPerson']),
    contactPhone: getStringValue(record, ['contactPhone']),
    bidAmount: formatCurrency(getStringValue(record, ['bidAmount', 'amount'])),
    bidStatus: getStringValue(record, ['bidStatus', 'status'], 'currentHighBid'),
    note: getStringValue(record, ['note']),
    bidTimestamp: getStringValue(record, ['bidTimestamp', 'createdAt'], dateCreated),
    dealershipName: getStringValue(record, ['dealershipName']),
    dealershipAddress: getStringValue(record, ['dealershipAddress']),
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

  // Exclude the 'id' field from exported columns
  const allHeaders = Object.keys(rows[0]);
  const headers = allHeaders.filter((h) => h !== 'id');
  const escapeCell = (value: unknown) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  const formatHeader = (header: string) => {
    return header
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const tableRows = rows
    .map((row) => `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join('')}</tr>`)
    .join('');
  const worksheet = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeCell(formatHeader(header))}</th>`).join('')}</tr></thead>
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
  const [dealers, setDealers] = useState<DealerRecord[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>(contactSeed);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(false);
  const [isDealersLoading, setIsDealersLoading] = useState(false);
  const [isContactsLoading, setIsContactsLoading] = useState(false);
  const [isStaffSaving, setIsStaffSaving] = useState(false);
  const [isDealerSaving, setIsDealerSaving] = useState(false);
  const [isVehicleApprovalSaving, setIsVehicleApprovalSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardTabKey>('staff');
  const [vehicleMakeFilter, setVehicleMakeFilter] = useState<string>();
  const [vehicleModelFilter, setVehicleModelFilter] = useState<string>();
  const [vehicleDateFilter, setVehicleDateFilter] = useState('');
  const [dealerDateFilter, setDealerDateFilter] = useState('');
  const [bidDateFilter, setBidDateFilter] = useState('');
  const [bidVehicleNameFilter, setBidVehicleNameFilter] = useState('');
  const [bidBuyerNameFilter, setBidBuyerNameFilter] = useState('');
  const [dealerNameFilter, setDealerNameFilter] = useState('');
  const [editingStaffEmail, setEditingStaffEmail] = useState<string | null>(null);
  const [editingDealerEmail, setEditingDealerEmail] = useState<string | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [vehicleBidHistoryData, setVehicleBidHistoryData] = useState<BidRecord[]>([]); // kept for TS ref only
  const [allBids, setAllBids] = useState<BidRecord[]>([]);
  const [approvalVehicle, setApprovalVehicle] = useState<VehicleRecord | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'APPROVED' | 'REJECTED' | 'SOLD' | 'AVAILABLE'>('APPROVED');
  const [selectedBid, setSelectedBid] = useState<BidRecord | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<DealerRecord | null>(null);
  const [dealerBidHistoryData, setDealerBidHistoryData] = useState<BidRecord[]>([]); // kept for TS ref only
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [temporaryPasswordMessage, setTemporaryPasswordMessage] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [form] = Form.useForm<StaffRecord>();
  const [dealerForm] = Form.useForm<Pick<DealerRecord, 'dealerName' | 'dealerEmail' | 'dealerPhone' | 'dealershipName' | 'dealershipAddress'>>();
  const [vehicleApprovalForm] = Form.useForm<VehicleApprovalForm>();
  const [vehicleValuationForm] = Form.useForm();
  const [isVehicleValuationSaving, setIsVehicleValuationSaving] = useState(false);

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
      const response = await fetchBuyers(token);
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

  useEffect(() => {
    if (token && vehicles.length > 0 && dealers.length > 0) {
      const validVehicles = vehicles.filter((v) => !!v.id);
      if (validVehicles.length === 0) return;
      
      Promise.all(validVehicles.map((v) => fetchVehicleBids(token, v.id!).catch(() => [])))
        .then((responses) => {
          const flatResponses = responses.flatMap((r) => getArrayPayload(r));
          setAllBids(flatResponses.map((b) => mapBidRecord(b, vehicles, dealers)));
        })
        .catch((error) => console.error('Failed to load all bids:', error));
    }
  }, [token, vehicles, dealers]);

  // Vehicle & dealer bid history are derived from allBids (no extra API calls needed)

  const saveStaff = async (values: StaffRecord) => {
    if (!token) {
      message.error('You must be logged in to onboard staff.');
      return;
    }

    setIsStaffSaving(true);
    try {
      if (editingStaffEmail) {
        const existingStaff = staff.find((member) => member.email === editingStaffEmail);
        if (existingStaff?.id) {
          await updateStaff(token, existingStaff.id, { name: values.name, email: values.email });
          message.success('Staff updated successfully.');
        } else {
          message.error('Unable to find staff ID for update.');
        }
        setEditingStaffEmail(null);
      } else {
        if (values.role === 'admin') {
          const temporaryPassword = generateTemporaryPassword();
          await createAdmin(token, { name: values.name, email: values.email, password: temporaryPassword });
          setTemporaryPasswordMessage('Admin created successfully. ');
        } else {
          await createStaff(token, { name: values.name, email: values.email });
          setTemporaryPasswordMessage('Staff created successfully.');
        }
        message.success(`${values.role === 'admin' ? 'Admin' : 'Staff'} onboarded successfully.`);
      }

      await loadStaff();
      form.resetFields();
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

  const startDealerEdit = (record: DealerRecord) => {
    setEditingDealerEmail(record.dealerEmail);
    dealerForm.setFieldsValue({
      dealerName: record.dealerName,
      dealerEmail: record.dealerEmail,
      dealerPhone: record.dealerPhone,
    });
  };

  const saveDealer = async (values: Pick<DealerRecord, 'dealerName' | 'dealerEmail' | 'dealerPhone' | 'dealershipName' | 'dealershipAddress'>) => {
    if (!token) {
      message.error('You must be logged in to onboard buyers.');
      return;
    }

    setIsDealerSaving(true);
    try {
      if (editingDealerEmail) {
        const existingDealer = dealers.find((d) => d.dealerEmail === editingDealerEmail);
        if (existingDealer?.id) {
          await updateBuyer(token, existingDealer.id, {
            name: values.dealerName,
            email: values.dealerEmail,
            phoneNumber: values.dealerPhone,
            dealerships: [{ name: values.dealershipName, address: values.dealershipAddress }],
          });
          message.success('Buyer updated successfully.');
        } else {
          message.error('Unable to find buyer ID for update.');
        }
        setEditingDealerEmail(null);
      } else {
        await createBuyer(token, {
          name: values.dealerName,
          email: values.dealerEmail,
          phoneNumber: values.dealerPhone,
          dealerships: [{ name: values.dealershipName, address: values.dealershipAddress }],
        });
        setTemporaryPasswordMessage('Buyer created successfully.');
        message.success('Buyer onboarded successfully.');
      }
      await loadDealers();
      dealerForm.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to onboard buyer.');
    } finally {
      setIsDealerSaving(false);
    }
  };

  const openVehicleApproval = (record: VehicleRecord, status: 'APPROVED' | 'REJECTED' | 'SOLD' | 'AVAILABLE') => {
    setApprovalVehicle(record);
    setApprovalStatus(status);
    vehicleApprovalForm.resetFields();
  };

  const closeVehicleApproval = () => {
    setApprovalVehicle(null);
    vehicleApprovalForm.resetFields();
  };

  const submitVehicleApproval = async (values: VehicleApprovalForm) => {
    if (!token) {
      message.error('You must be logged in to update vehicles.');
      return;
    }

    if (!approvalVehicle?.id) {
      message.error('Vehicle ID is missing. Please refresh and try again.');
      return;
    }

    const payload: { status: 'APPROVED' | 'REJECTED' | 'SOLD' | 'AVAILABLE'; auctionStartTime?: string; auctionEndTime?: string } = {
      status: approvalStatus,
    };

    if (approvalStatus === 'APPROVED') {
      const auctionStartTime = values.auctionStartTime.toISOString();
      const auctionEndTime = values.auctionEndTime.toISOString();

      if (new Date(auctionEndTime).getTime() <= new Date(auctionStartTime).getTime()) {
        message.error('Auction end time must be after the start time.');
        return;
      }

      payload.auctionStartTime = auctionStartTime;
      payload.auctionEndTime = auctionEndTime;
    }

    setIsVehicleApprovalSaving(true);
    try {
      await approveVehicle(token, approvalVehicle.id, payload);

      setSelectedVehicle((currentVehicle) => {
        if (!currentVehicle || currentVehicle.id !== approvalVehicle.id) {
          return currentVehicle;
        }
        return { 
          ...currentVehicle, 
          status: approvalStatus, 
          auctionStartTime: payload.auctionStartTime ?? currentVehicle.auctionStartTime, 
          auctionEndTime: payload.auctionEndTime ?? currentVehicle.auctionEndTime 
        };
      });
      await loadVehicles();
      closeVehicleApproval();
      message.success(`Vehicle marked as ${approvalStatus.toLowerCase()} successfully.`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to update vehicle status.');
    } finally {
      setIsVehicleApprovalSaving(false);
    }
  };

  const saveVehicleValuation = async (values: any) => {
    if (!token || !selectedVehicle?.id) return;
    
    setIsVehicleValuationSaving(true);
    try {
      const parsedValues = {
        ...values,
        kbbTradeInValue: values.kbbTradeInValue ? Number(values.kbbTradeInValue) : undefined,
        kbbPrivatePartyValue: values.kbbPrivatePartyValue ? Number(values.kbbPrivatePartyValue) : undefined,
        mmrValue: values.mmrValue ? Number(values.mmrValue) : undefined,
        carMaxOffer: values.carMaxOffer ? Number(values.carMaxOffer) : undefined,
        carvanaOffer: values.carvanaOffer ? Number(values.carvanaOffer) : undefined,
        acvWholesaleEstimate: values.acvWholesaleEstimate ? Number(values.acvWholesaleEstimate) : undefined,
        finalTransactionPrice: values.finalTransactionPrice ? Number(values.finalTransactionPrice) : null,
      };
      await updateVehicleValuation(token, selectedVehicle.id, parsedValues);
      message.success('Vehicle valuation updated successfully.');
      await loadVehicles(); // refresh data
      // Update selected vehicle in state so modal doesn't need to close
      setSelectedVehicle(prev => prev ? { ...prev, ...parsedValues } : null);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to update vehicle valuation.');
    } finally {
      setIsVehicleValuationSaving(false);
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

  const bidVehicleNameOptions = useMemo(
    () => Array.from(new Set(allBids.map((b) => b.vehicleName).filter(Boolean))).map((v) => ({ label: v, value: v })),
    [allBids]
  );

  const bidBuyerNameOptions = useMemo(
    () => Array.from(new Set(allBids.map((b) => b.buyerName).filter(Boolean))).map((d) => ({ label: d, value: d })),
    [allBids]
  );

  // Derived bid history — filter allBids by the selected vehicle/dealer ID
  const vehicleBids = useMemo(
    () => (selectedVehicle?.id ? allBids.filter((b) => b.vehicleId === selectedVehicle.id) : []),
    [allBids, selectedVehicle]
  );

  const dealerBids = useMemo(
    () => (selectedDealer?.id ? allBids.filter((b) => b.dealerId === selectedDealer.id) : []),
    [allBids, selectedDealer]
  );

  const dealerNameOptions = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.dealerName).filter(Boolean))).map((d) => ({ label: d, value: d })),
    [dealers]
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
    () =>
      allBids.filter(
        (bid) =>
          (!bidDateFilter || bid.dateCreated === bidDateFilter) &&
          (!bidVehicleNameFilter || bid.vehicleName.toLowerCase().includes(bidVehicleNameFilter.toLowerCase())) &&
          (!bidBuyerNameFilter || bid.buyerName.toLowerCase().includes(bidBuyerNameFilter.toLowerCase()))
      ),
    [bidDateFilter, bidVehicleNameFilter, bidBuyerNameFilter, allBids]
  );

  const filteredDealers = useMemo(
    () =>
      dealers.filter(
        (dealer) =>
          (!dealerDateFilter || dealer.dateCreated === dealerDateFilter) &&
          (!dealerNameFilter || dealer.dealerName.toLowerCase().includes(dealerNameFilter.toLowerCase()))
      ),
    [dealerDateFilter, dealerNameFilter, dealers]
  );

  const handleLogout = () => {
    logout();
  };

  const handleResetPassword = () => {
    setIsChangePasswordOpen(true);
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

  useEffect(() => {
    if (user?.role === 'staff' && activeSection === 'staff') {
      setActiveSection('vehicles');
    }
  }, [activeSection, user?.role]);

  const staffColumns: TableColumnsType<StaffRecord> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: StaffRecord['role']) => <Tag color={role === 'admin' ? 'green' : 'blue'}>{role.toUpperCase()}</Tag>,
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      render: (createdAt: string) => (createdAt ? formatDateLabel(createdAt) : 'N/A'),
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
      render: (lastModifiedBy: string) => lastModifiedBy || 'N/A',
    },
    {
      title: 'Last Modified At',
      dataIndex: 'lastModifiedAt',
      render: (lastModifiedAt: string) => (lastModifiedAt ? formatDateLabel(lastModifiedAt) : 'N/A'),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', label: 'Edit' },
            ],
            onClick: ({ key }) => {
              if (key === 'edit') startStaffEdit(record);
            },
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button className="!border-[#575757] !bg-[#111111] !text-[#24d725] hover:!border-[#24d725] hover:!bg-[#151515]" icon={<RightOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const vehicleColumns: TableColumnsType<VehicleRecord> = [
    {
      title: 'Vehicle',
      key: 'vehicle',
      width: 360,
      render: (_, vehicle) => {
        const firstUpload = vehicle.uploadItems[0];

        return (
          <div className="flex min-w-[320px] items-center gap-4">
            {firstUpload ? (
              <Image
                alt={firstUpload.name || vehicle.vehicleName}
                className="!h-16 !w-24 rounded-md object-cover"
                preview={{ mask: 'Preview' }}
                src={firstUpload.url}
              />
            ) : (
              <div className="flex h-16 w-24 items-center justify-center rounded-md border border-[#575757] bg-[#171717] text-xs font-bold text-[#a8a8a8]">
                No Image
              </div>
            )}
            <div>
              <Text className="block !font-bold !text-white">{vehicle.vehicleName}</Text>
              <Text className="mt-1 block !text-sm !text-[#c8c8c8]">VIN: {vehicle.vin || 'N/A'}</Text>
            </div>
          </div>
        );
      },
    },
    { title: 'Date Created', dataIndex: 'dateCreated', render: (dateCreated: string) => formatDateLabel(dateCreated) },
    { title: 'Seller Name', dataIndex: 'sellerName' },
    { title: 'Seller Phone', dataIndex: 'sellerPhoneNo' },
    { title: 'Seller Email', dataIndex: 'sellerEmail' },
    { title: 'Make', dataIndex: 'make' },
    { title: 'Model', dataIndex: 'model' },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Pending', value: 'PENDING' },
        { text: 'Approved', value: 'APPROVED' },
        { text: 'Rejected', value: 'REJECTED' },
        { text: 'Bidding Active', value: 'BIDDING_ACTIVE' },
        { text: 'Bidding Ended', value: 'BIDDING_ENDED' },
        { text: 'Sold', value: 'SOLD' },
        { text: 'Available', value: 'AVAILABLE' },
      ],
      onFilter: (value, record) => record.status.toUpperCase() === value,
      render: renderApprovalStatusTag,
    },
    {
      title: 'Actions',
      render: (_, record) => {
        const isPending = record.status === 'PENDING';
        const isBiddingEnded = record.status === 'BIDDING_ENDED';
        const isAvailable = record.status === 'AVAILABLE';

        const items = [
          { key: 'view', label: 'View' },
          ...((isPending || isAvailable) && record.id
            ? [
                { key: 'approve', label: 'Approve' },
                { key: 'reject', label: 'Reject', danger: true },
              ]
            : []),
          ...(isBiddingEnded && record.id
            ? [
                { key: 'mark_sold', label: 'Mark as Sold' },
                { key: 'mark_available', label: 'Mark as Available' },
              ]
            : []),
        ];

        const handleAction = (key: string) => {
          if (key === 'view') setSelectedVehicle(record);
          if (key === 'approve') openVehicleApproval(record, 'APPROVED');
          if (key === 'reject') openVehicleApproval(record, 'REJECTED');
          if (key === 'mark_sold') openVehicleApproval(record, 'SOLD');
          if (key === 'mark_available') openVehicleApproval(record, 'AVAILABLE');
        };

        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => handleAction(key),
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              aria-label={`Open actions for ${record.vehicleName}`}
              className="!border-[#575757] !bg-[#111111] !text-[#24d725] hover:!border-[#24d725] hover:!bg-[#151515]"
              icon={<RightOutlined />}
              size="small"
            />
          </Dropdown>
        );
      },
    },
  ];

  const bidColumns: TableColumnsType<BidRecord> = [
    { title: 'Bid ID', dataIndex: 'bidId' },
    { title: 'Date Created', dataIndex: 'dateCreated', render: (dateCreated: string) => formatDateLabel(dateCreated) },
    { title: 'Vehicle Name', dataIndex: 'vehicleName' },
    { title: 'Buyer Name', dataIndex: 'buyerName' },
    { title: 'Buyer Email', dataIndex: 'buyerEmail' },
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
    { title: 'Buyer Name', dataIndex: 'dealerName' },
    { title: 'Buyer Email', dataIndex: 'dealerEmail' },
    { title: 'Buyer Phone', dataIndex: 'dealerPhone' },
    { title: 'Dealership Name', dataIndex: 'dealershipName' },
    { title: 'Date Created', dataIndex: 'dateCreated', render: (dateCreated: string) => formatDateLabel(dateCreated) },
    { title: 'Last Modified By', dataIndex: 'lastModifiedBy' },
    { title: 'Last Modified At', dataIndex: 'lastModifiedAt', render: (date: string) => formatDateLabel(date) },
    {
      title: 'Actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', label: 'View' },
              { key: 'edit', label: 'Edit' },
            ],
            onClick: ({ key }) => {
              if (key === 'view') setSelectedDealer(record);
              if (key === 'edit') startDealerEdit(record);
            },
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button className="!border-[#575757] !bg-[#111111] !text-[#24d725] hover:!border-[#24d725] hover:!bg-[#151515]" icon={<RightOutlined />} size="small" />
        </Dropdown>
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
                { label: 'Approval Status', value: renderApprovalStatusTag(selectedVehicle.status) },
                { label: 'Auction Start Time', value: selectedVehicle.auctionStartTime },
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
      label: 'Vehicles',
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
              <Select
                allowClear
                className="min-w-[200px] [&_.ant-select-selector]:!border-[#575757] [&_.ant-select-selector]:!bg-[#242424] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-placeholder]:!text-[#a8a8a8]"
                onChange={(val) => setBidVehicleNameFilter(val ?? '')}
                options={bidVehicleNameOptions}
                placeholder="Filter by vehicle name"
                value={bidVehicleNameFilter || undefined}
              />
              <Select
                allowClear
                className="min-w-[200px] [&_.ant-select-selector]:!border-[#575757] [&_.ant-select-selector]:!bg-[#242424] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-placeholder]:!text-[#a8a8a8]"
                onChange={(val) => setBidBuyerNameFilter(val ?? '')}
                options={bidBuyerNameOptions}
                placeholder="Filter by buyer name"
                value={bidBuyerNameFilter || undefined}
              />
              <DatePicker
                allowClear
                className="!border-[#575757] !bg-[#242424] [&_.ant-picker-input_input]:!text-white [&_.ant-picker-input_input::placeholder]:!text-[#a8a8a8] [&_.ant-picker-suffix]:!text-[#c8c8c8]"
                onChange={(_, dateString) => setBidDateFilter(normalizeDateString(dateString))}
                placeholder="Filter by date created"
              />
              <Button onClick={() => { setBidDateFilter(''); setBidVehicleNameFilter(''); setBidBuyerNameFilter(''); }}>Clear Filters</Button>
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
      label: 'Dealers',
      children: (
        <div className="space-y-6">
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-6">
            <Title className="!mb-5 !mt-0 !text-2xl !text-white" level={2}>
              {editingDealerEmail ? 'Edit Buyer' : 'Onboard Buyer'}
            </Title>
            <Form form={dealerForm} layout="vertical" onFinish={saveDealer} className="[&_.ant-form-item-label>label]:!text-white [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white">
              <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
                <Form.Item label="Buyer Name" name="dealerName" rules={[{ required: true, message: 'Enter buyer name' }]}>
                  <Input placeholder="e.g. John Doe" />
                </Form.Item>
                <Form.Item label="Buyer Email" name="dealerEmail" rules={[{ required: true, message: 'Enter buyer email' }, { type: 'email', message: 'Enter a valid email' }]}>
                  <Input placeholder="buyer@company.com" />
                </Form.Item>
                <Form.Item label="Buyer Phone" name="dealerPhone" rules={[{ required: true, message: 'Enter phone number' }]}>
                  <Input placeholder="(555) 555-0123" />
                </Form.Item>
                <Form.Item label="Dealership Name" name="dealershipName" rules={[{ required: true, message: 'Enter dealership name' }]}>
                  <Input placeholder="e.g. Metro Auto Group" />
                </Form.Item>
                <Form.Item label="Dealership Address" name="dealershipAddress" rules={[{ required: true, message: 'Enter dealership address' }]}>
                  <Input placeholder="e.g. 123 Main St, Louisville, KY" />
                </Form.Item>
                <Form.Item label=" " className="max-[620px]:!mb-0 flex items-end">
                  <Space>
                    <Button htmlType="submit" loading={isDealerSaving} type="primary">
                      {editingDealerEmail ? 'Save' : 'Add Buyer'}
                    </Button>
                    {editingDealerEmail && (
                      <Button onClick={() => { setEditingDealerEmail(null); dealerForm.resetFields(); }}>
                        Cancel
                      </Button>
                    )}
                  </Space>
                </Form.Item>
              </div>
            </Form>
          </section>
          <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-4">
            <Space size={16} wrap>
              <Select
                allowClear
                className="min-w-[200px] [&_.ant-select-selector]:!border-[#575757] [&_.ant-select-selector]:!bg-[#242424] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-placeholder]:!text-[#a8a8a8]"
                onChange={(val) => setDealerNameFilter(val ?? '')}
                options={dealerNameOptions}
                placeholder="Filter by dealer name"
                value={dealerNameFilter || undefined}
              />
              <DatePicker
                allowClear
                className="!border-[#575757] !bg-[#242424] [&_.ant-picker-input_input]:!text-white [&_.ant-picker-input_input::placeholder]:!text-[#a8a8a8] [&_.ant-picker-suffix]:!text-[#c8c8c8]"
                onChange={(_, dateString) => setDealerDateFilter(normalizeDateString(dateString))}
                placeholder="Filter by date created"
              />
              <Button onClick={() => { setDealerDateFilter(''); setDealerNameFilter(''); }}>Clear Filters</Button>
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
      label: 'Contacts',
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
    { key: 'vehicles', label: 'Vehicles' },
    { key: 'bids', label: 'Bids' },
    { key: 'dealers', label: 'Dealers' },
    { key: 'contacts', label: 'Contacts' },
  ];
  const visibleTabs = user?.role === 'staff' ? tabs.filter((tab) => tab.key !== 'staff') : tabs;
  const visibleDashboardMenuItems = user?.role === 'staff' ? dashboardMenuItems.filter((item) => item.key !== 'staff') : dashboardMenuItems;

  return (
    <main className="min-h-screen bg-lane-ink text-white">
      <header className="sticky top-0 z-[1000] flex min-h-[92px] items-center justify-between gap-8 bg-black px-16 text-white max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-2 max-[980px]:px-6 max-[980px]:py-3.5">
        <img className="h-[120px] w-auto max-[980px]:h-16" src={logo} alt="Lane16 logo" />
        <div className="flex items-center gap-8 max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-4">
          <nav aria-label="Admin dashboard navigation">
            <Space size={28} className="max-[980px]:flex-wrap max-[620px]:!gap-3.5">
              {visibleDashboardMenuItems.map((item) => {
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
          items={visibleTabs}
          onChange={(key) => setActiveSection(key as DashboardTabKey)}
          renderTabBar={() => <></>}
        />
      </div>

      <Modal
        centered
        footer={null}
        onCancel={() => setSelectedVehicle(null)}
        afterOpenChange={(open) => {
          if (open && selectedVehicle) {
            vehicleValuationForm.setFieldsValue(selectedVehicle);
          }
        }}
        open={Boolean(selectedVehicle)}
        title={<span className="text-white m-3">{selectedVehicle?.vehicleName ?? 'Vehicle Details'}</span>}
        width={980}
        className="[&_.ant-modal-close]:!text-green-300 [&_.ant-modal-close]:pr-4 [&_.ant-modal-close]:!mt-1 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
      >
        {selectedVehicle && (
          <Tabs
            defaultActiveKey="vehicle-details"
            className="[&_.ant-tabs-nav]:!before:border-[#575757] [&_.ant-tabs-tab]:!text-black [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#24d725]"
            items={[
              {
                key: 'vehicle-details',
                label: 'Vehicle Details',
                children: (
                  <div className="space-y-8">
                    {vehicleSections.map((section) => (
                      <section key={section.heading}>
                        <Title className="!mb-4 !mt-0 !text-xl !text-[#24d725]" level={3}>
                          {section.heading}
                        </Title>
                        <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                          {section.fields.map((field) => (
                            <div className="rounded-lg border border-[#575757] bg-[#111111] p-4" key={`${section.heading}-${field.label}`}>
                              <Text className="block !text-xs !font-extrabold !uppercase !text-white">
                                {field.label}
                              </Text>
                              <div className="mt-2 break-words text-base text-white">{field.value || 'N/A'}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ),
              },
              {
                key: 'vehicle-uploads',
                label: 'Uploads',
                children: selectedVehicle.uploadItems.length ? (
                  <Image.PreviewGroup>
                    <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
                      {selectedVehicle.uploadItems.map((upload) => (
                        <figure className="rounded-lg border border-[#575757] bg-[#111111] p-3" key={upload.id}>
                          <Image
                            alt={upload.name}
                            className="!h-44 !w-full rounded-md object-cover"
                            src={upload.url}
                          />
                          <figcaption className="mt-3 truncate text-sm text-[#c8c8c8]">{upload.name}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                ) : (
                  <div className="rounded-lg border border-[#575757] bg-[#111111] p-6 text-center text-[#c8c8c8]">
                    No uploads available for this vehicle.
                  </div>
                ),
              },
              {
                key: 'vehicle-bids',
                label: 'Bid History',
                children: (
                  <DataTable
                    columns={bidColumns}
                    dataSource={vehicleBids}
                    rowKey={(record) => record.bidId || record.dateCreated}
                    searchable
                    searchPlaceholder="Search vehicle bid history"
                  />
                ),
              },
              {
                key: 'vehicle-valuation',
                label: 'Valuation & Conclusion',
                children: (
                  <div className="space-y-6">
                    <Paragraph className="!text-[#c8c8c8]">
                      These fields are for internal use to track wholesale values and final sale status.
                    </Paragraph>
                    <Form
                      form={vehicleValuationForm}
                      layout="vertical"
                      onFinish={saveVehicleValuation}
                      initialValues={selectedVehicle}
                      className="[&_.ant-form-item-label>label]:!text-black [&_.ant-input-number]:!w-full [&_.ant-input-number]:!bg-[#242424] [&_.ant-input-number]:!border-[#575757] [&_.ant-input-number-input]:!text-white [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white"
                    >
                      <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                        <Form.Item label="KBB Trade-In Value ($)" name="kbbTradeInValue">
                          <Input type="number" prefix="$" placeholder="e.g. 25000" />
                        </Form.Item>
                        <Form.Item label="KBB Private Party Value ($)" name="kbbPrivatePartyValue">
                          <Input type="number" prefix="$" placeholder="e.g. 28000" />
                        </Form.Item>
                        <Form.Item label="MMR Value ($)" name="mmrValue">
                          <Input type="number" prefix="$" placeholder="e.g. 26000" />
                        </Form.Item>
                        <Form.Item label="ACV Wholesale Estimate ($)" name="acvWholesaleEstimate">
                          <Input type="number" prefix="$" placeholder="e.g. 25500" />
                        </Form.Item>
                        <Form.Item label="CarMax Offer ($)" name="carMaxOffer">
                          <Input type="number" prefix="$" placeholder="e.g. 24000" />
                        </Form.Item>
                        <Form.Item label="Carvana Offer ($)" name="carvanaOffer">
                          <Input type="number" prefix="$" placeholder="e.g. 24500" />
                        </Form.Item>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                        <Form.Item label="Final Transaction Price ($)" name="finalTransactionPrice">
                          <Input type="number" prefix="$" placeholder="e.g. 25000" />
                        </Form.Item>
                        <Form.Item label="Reason Not Sold" name="reasonNotSold">
                          <Input placeholder="e.g. Seller backed out, Reserve not met" />
                        </Form.Item>
                      </div>
                      <Form.Item label="Admin Valuation Notes" name="adminValuationNotes" className="mt-4">
                        <Input.TextArea rows={4} placeholder="Internal notes..." />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={isVehicleValuationSaving}>
                        Save Valuation Data
                      </Button>
                    </Form>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Modal>
      <Modal
        centered
        confirmLoading={isVehicleApprovalSaving}
        okButtonProps={{ danger: approvalStatus === 'REJECTED' }}
        okText={approvalStatus === 'APPROVED' ? 'Approve Vehicle' : approvalStatus === 'SOLD' ? 'Mark as Sold' : approvalStatus === 'AVAILABLE' ? 'Mark as Available' : 'Reject Vehicle'}
        onCancel={closeVehicleApproval}
        onOk={() => vehicleApprovalForm.submit()}
        open={Boolean(approvalVehicle)}
        title={<span className="text-white m-3">{approvalStatus === 'APPROVED' ? 'Approve Vehicle' : approvalStatus === 'SOLD' ? 'Mark as Sold' : approvalStatus === 'AVAILABLE' ? 'Mark as Available' : 'Reject Vehicle'}</span>}
        className="[&_.ant-modal-close]:!text-green-300 [&_.ant-modal-close]:pr-4 [&_.ant-modal-close]:!mt-1 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
      >
        <Form
          form={vehicleApprovalForm}
          layout="vertical"
          onFinish={submitVehicleApproval}
          className="[&_.ant-form-item-label>label]:!text-black [&_.ant-picker]:!border-[#575757] [&_.ant-picker]:!bg-[#242424] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input::placeholder]:!text-[#c8c8c8]"
        >
          <Paragraph className="!text-[#c8c8c8]">
            {approvalVehicle?.vehicleName} will be marked as {approvalStatus.replace(/_/g, ' ').toLowerCase()}.
            {approvalStatus === 'APPROVED' && ' Set the auction window required by the server.'}
          </Paragraph>
          {approvalStatus === 'APPROVED' && (
            <>
              <Form.Item
                label="Auction Start Time"
                name="auctionStartTime"
                rules={[{ required: true, message: 'Select auction start time' }]}
              >
                <DatePicker className="w-full" showTime />
              </Form.Item>
              <Form.Item
                className="!text-black"
                label="Auction End Time"
                name="auctionEndTime"
                rules={[{ required: true, message: 'Select auction end time' }]}
              >
                <DatePicker className="w-full" showTime />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} token={token} />
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
                    { label: 'Buyer Name', value: selectedBid.buyerName },
                    { label: 'Buyer Email', value: selectedBid.buyerEmail },
                    { label: 'Buyer Phone', value: selectedBid.buyerPhone },
                    { label: 'Dealership Override Name', value: selectedBid.dealershipName },
                    { label: 'Dealership Override Address', value: selectedBid.dealershipAddress },
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
        title={<span className="text-white m-3">{selectedDealer?.dealerName ?? 'Buyer Details'}</span>}
        width={980}
        className="[&_.ant-modal-close]:!text-green-300 [&_.ant-modal-close]:pr-4 [&_.ant-modal-close]:!mt-1 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
      >
        {selectedDealer && (
          <Tabs
            defaultActiveKey="dealer-details"
            className="[&_.ant-tabs-nav]:!before:border-[#575757] [&_.ant-tabs-tab]:!text-black [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#24d725]"
            items={[
                    {
                      key: 'dealer-details',
                      label: 'Buyer Details',
                      children: (
                        <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                          {[
                            { label: 'Buyer Name', value: selectedDealer.dealerName },
                            { label: 'Buyer Email', value: selectedDealer.dealerEmail },
                            { label: 'Buyer Phone', value: selectedDealer.dealerPhone },
                            { label: 'Dealership Name', value: selectedDealer.dealershipName },
                            { label: 'Dealership Address', value: selectedDealer.dealershipAddress },
                            { label: 'Date Created', value: formatDateLabel(selectedDealer.dateCreated) },
                            { label: 'Last Modified At', value: formatDateLabel(selectedDealer.lastModifiedAt) },
                            { label: 'Last Modified By', value: selectedDealer.lastModifiedBy },
                          ].map((field) => (
                      <div className="rounded-lg border border-[#575757] bg-[#111111] p-4" key={field.label}>
                        <Text className="block !text-xs !font-extrabold !uppercase !text-white">
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
                    dataSource={dealerBids}
                    rowKey={(record) => record.bidId || record.dateCreated}
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

