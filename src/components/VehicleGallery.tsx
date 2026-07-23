import { useState } from 'react';
import { Slider, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';

type VehicleGalleryProps = {
  vehicle: Vehicle;
};

export function VehicleGallery({ vehicle }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const thumbsToShow = 4;
  const gallery = vehicle.galleryImageSrcs || [];

  const mainSrc = gallery.length ? gallery[selectedIndex] : vehicle.imageSrc;

  return (
    <section className="overflow-hidden rounded-xl border border-[#575757] bg-[#0b0b0b]">
      <img
        className="h-[470px] w-full rounded-t-[10px] object-cover max-[980px]:h-[360px] max-[620px]:h-[260px]"
        src={mainSrc}
        alt={vehicle.title}
      />

      <div className="flex items-center gap-3 px-4 pb-2.5 pt-3">
        {gallery.length > thumbsToShow && (
          <Button
            icon={<LeftOutlined />}
            size="small"
            onClick={() => {
              const next = Math.max(0, startIndex - 1);
              setStartIndex(next);
              if (selectedIndex < next) setSelectedIndex(next);
            }}
            className="!bg-transparent !border-none !text-[#c8c8c8]"
          />
        )}

        <div className="grid flex-1 grid-cols-4 gap-2 max-[620px]:grid-cols-2">
          {gallery.slice(startIndex, startIndex + thumbsToShow).map((imageSrc, index) => {
            const globalIndex = startIndex + index;
            const isSelected = globalIndex === selectedIndex;

            return (
              <img
                key={`${imageSrc}-${globalIndex}`}
                className={`h-32 w-full rounded-md object-cover cursor-pointer ${isSelected ? 'ring-2 ring-[#24d725]' : ''}`}
                src={imageSrc}
                alt={`${vehicle.title} detail ${globalIndex + 1}`}
                onClick={() => setSelectedIndex(globalIndex)}
              />
            );
          })}
        </div>

        {gallery.length > thumbsToShow && (
          <Button
            icon={<RightOutlined />}
            size="small"
            onClick={() => {
              const maxStart = Math.max(0, gallery.length - thumbsToShow);
              const next = Math.min(maxStart, startIndex + 1);
              setStartIndex(next);
              if (selectedIndex > next + thumbsToShow - 1) setSelectedIndex(next + thumbsToShow - 1);
            }}
            className="!bg-transparent !border-none !text-[#c8c8c8]"
          />
        )}
      </div>

      {gallery.length > thumbsToShow && (
        <div className="px-4 pb-3 pt-2">
          <Slider
            min={0}
            max={Math.max(0, gallery.length - thumbsToShow)}
            step={1}
            value={startIndex}
            onChange={(val) => setStartIndex(val as number)}
            railStyle={{ background: '#333' }}
            trackStyle={{ background: '#24d725' }}
            handleStyle={{ borderColor: '#24d725' }}
          />
        </div>
      )}
    </section>
  );
}
