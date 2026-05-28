export type TitleStatus = 'CLEAN' | 'LIEN' | 'SALVAGE' | 'REBUILT' | 'MISSING';

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
};
