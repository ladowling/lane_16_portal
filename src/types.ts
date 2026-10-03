export type TitleStatus = '4S' | 'Turbo' | 'xDrive' | '4MATIC' | 'F Sport' | 'XSE'  | 'Premium Plus' | '3.5T Sport Prsetige' | 'Touring' | 'Salvage' | 'Rebuilt' | 'Lien' | 'Missing' | 'Unknown' | 'BIDDING_ENDED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'BIDDING_ACTIVE' | 'SOLD' | 'AVAILABLE';

export type VehiclePhotoVariant = 'road' | 'garage' | 'silver' | 'detail' | 'engine' | 'interior' | 'spring';

export type VehicleTitleStatus = 'IN_HAND' | 'LIEN';

export const TITLE_STATUS_LABELS: Record<VehicleTitleStatus, string> = {
  IN_HAND: 'In Hand',
  LIEN: 'Lien',
};

export const formatTitleStatus = (status?: string | null): string =>
  (status && TITLE_STATUS_LABELS[status as VehicleTitleStatus]) || '-';

// Labels for the option values the public seller form submits (leather/cloth, roof, drivetrain, transmission, odor)
const VEHICLE_OPTION_LABELS: Record<string, string> = {
  leather: 'Leather',
  cloth: 'Cloth',
  mixed: 'Mixed',
  other: 'Other',
  sunroof: 'Sunroof',
  hardtop: 'Hardtop',
  softtop: 'Softtop',
  none: 'None',
  awd: 'AWD',
  rwd: 'RWD',
  fwd: 'FWD',
  automatic: 'Automatic',
  manual: 'Manual',
  smoker: 'Smoker',
};

export const formatVehicleOption = (value?: string | null): string =>
  value ? VEHICLE_OPTION_LABELS[value.trim().toLowerCase()] ?? value : '';

export type Vehicle = {
  id: string;
  title: string;
  subtitle: string;
  mileage: string;
  status: TitleStatus;
  highestBid: string;
  currentHighBid: string;
  nextMinimumBid: string;
  endsIn: string;
  bidCount: number;
  imageSrc: string;
  galleryImageSrcs: string[];
  detailsTitle: string;
  specs: string[];
  description: string;
  condition: string;
  canBid?: boolean;
  biddingStatusLabel?: string;
  /** ISO string for when the auction ends — used for the live countdown in BidPanel */
  auctionEndTime?: string;
  /** ISO string for when the auction starts — used to determine upcoming status */
  auctionStartTime?: string;
  /** Minimum bid increment amount in dollars */
  bidIncrementAmount?: number;
  reserveMet?: boolean;
  engine?: string;
  leatherOrCloth?: string;
  roof?: string;
  drivetrain?: string;
  transmission?: string;
  accidentHistory?: string;
  additionalDisclosures?: string;
  titleStatus?: VehicleTitleStatus;
  vin?: string;
  fuelType?: string;
  bodyStyle?: string;
  year?: string;
  make?: string;
  model?: string;
  trim?: string;
  location?: string;
  exteriorColor?: string;
  interiorColor?: string;
  exteriorCondition?: string;
  interiorCondition?: string;
  mechanicalCondition?: string;
  tireCondition?: string;
  /** Read back from the seller's condition summary — the backend has no dedicated field */
  warningLights?: string;
  /** Interior odor from the seller's condition summary, else derived from smokerVehicle */
  interiorOdor?: string;
  smokerVehicle?: boolean;
};

