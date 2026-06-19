export type TitleStatus = '4S' | 'Turbo' | 'xDrive' | '4MATIC' | 'F Sport' | 'XSE'  | 'Premium Plus' | '3.5T Sport Prsetige' | 'Touring' | 'Salvage' | 'Rebuilt' | 'Lien' | 'Missing' | 'Unknown';

export type VehiclePhotoVariant = 'road' | 'garage' | 'silver' | 'detail' | 'engine' | 'interior' | 'spring';

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
  heroVariant: VehiclePhotoVariant;
  galleryVariants: VehiclePhotoVariant[];
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
};

