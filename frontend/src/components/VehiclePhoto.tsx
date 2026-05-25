import type { VehiclePhotoVariant } from '../types';

type VehiclePhotoProps = {
  variant: VehiclePhotoVariant;
  size?: 'card' | 'hero' | 'thumb';
};

export function VehiclePhoto({ variant, size = 'card' }: VehiclePhotoProps) {
  return (
    <div className={`vehicle-photo vehicle-photo-${variant} vehicle-photo-${size}`} aria-label="Car placeholder image">
      <div className="vehicle-shape">
        <span className="vehicle-cabin" />
        <span className="vehicle-body" />
        <span className="vehicle-light vehicle-light-left" />
        <span className="vehicle-light vehicle-light-right" />
        <span className="vehicle-wheel vehicle-wheel-left" />
        <span className="vehicle-wheel vehicle-wheel-right" />
      </div>
    </div>
  );
}
