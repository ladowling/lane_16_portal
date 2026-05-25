import type { Vehicle } from '../types';
import { VehiclePhoto } from './VehiclePhoto';

type VehicleGalleryProps = {
  vehicle: Vehicle;
};

export function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  return (
    <section className="gallery-panel">
      <VehiclePhoto variant={vehicle.heroVariant} size="hero" />
      <div className="thumbnail-grid">
        {vehicle.galleryVariants.map((variant, index) => (
          <VehiclePhoto key={`${variant}-${index}`} variant={variant} size="thumb" />
        ))}
      </div>
    </section>
  );
}
