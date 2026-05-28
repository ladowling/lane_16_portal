import type { Vehicle } from '../types';

type VehicleGalleryProps = {
  vehicle: Vehicle;
};

export function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#575757] bg-[#0b0b0b]">
      <img className="h-[470px] w-full rounded-t-[10px] object-cover max-[980px]:h-[360px] max-[620px]:h-[260px]" src={vehicle.imageSrc} alt={vehicle.title} />
      <div className="grid grid-cols-4 gap-2 px-4 pb-2.5 pt-3 max-[620px]:grid-cols-2">
        {vehicle.galleryImageSrcs.map((imageSrc, index) => (
          <img
            key={`${imageSrc}-${index}`}
            className="h-32 w-full rounded-md object-cover"
            src={imageSrc}
            alt={`${vehicle.title} detail ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
