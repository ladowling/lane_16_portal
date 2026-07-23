import type { VehiclePhotoVariant } from '../types';

type VehiclePhotoProps = {
  variant: VehiclePhotoVariant;
  size?: 'card' | 'hero' | 'thumb';
};

const sizeClasses = {
  card: 'h-[214px] max-[620px]:h-[190px]',
  hero: 'h-[470px] rounded-t-[10px] max-[980px]:h-[360px] max-[620px]:h-[260px]',
  thumb: 'h-32',
};

const shapeClasses = {
  card: 'bottom-[26%] right-[7%] h-[43%] w-[74%]',
  hero: 'bottom-[22%] right-[4%] h-[48%] w-[88%]',
  thumb: 'bottom-[22%] right-[6%] h-[52%] w-[84%]',
};

const variantClasses = {
  road: 'bg-[linear-gradient(180deg,rgba(238,243,246,0.42)_0_35%,rgba(17,23,25,0.68)_36%_100%),linear-gradient(110deg,#1b2a30_0%,#27353d_46%,#0b0e10_100%)]',
  garage: 'bg-[radial-gradient(circle_at_70%_50%,rgba(133,167,218,0.34),transparent_34%),linear-gradient(90deg,#050505,#151a20_58%,#020202)]',
  silver: 'bg-[linear-gradient(180deg,rgba(247,247,241,0.7),rgba(137,139,133,0.38)_45%,rgba(16,17,16,0.76)),linear-gradient(120deg,#e2e3dc,#444840_58%,#101010)]',
  detail: 'bg-[radial-gradient(circle_at_25%_28%,rgba(255,255,255,0.8),transparent_24%),linear-gradient(135deg,#aeb4bb,#101315_62%,#050505)]',
  engine: 'bg-[repeating-linear-gradient(115deg,rgba(211,166,91,0.42)_0_8px,rgba(23,36,33,0.7)_8px_20px),linear-gradient(135deg,#26312c,#111111)]',
  interior: 'bg-[radial-gradient(circle_at_58%_34%,rgba(218,228,242,0.7),transparent_20%),linear-gradient(135deg,#2b3038,#080808_70%)]',
  spring: 'bg-[repeating-linear-gradient(105deg,#121212_0_18px,#cacaca_19px_24px,#080808_25px_40px),linear-gradient(135deg,#050505,#2c2c2c)]',
};

export function VehiclePhoto({ variant, size = 'card' }: VehiclePhotoProps) {
  return (
    <div
      className={`relative w-full overflow-hidden before:absolute before:bottom-[12%] before:right-[-8%] before:h-1.5 before:w-[76%] before:rotate-[-5deg] before:bg-white/35 before:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[31%] after:w-full after:bg-black/40 after:content-[''] ${variantClasses[variant]} ${sizeClasses[size]}`}
      aria-label="Car placeholder image"
    >
      <div className={`absolute z-[1] skew-x-[-10deg] ${shapeClasses[size]}`}>
        <span className="absolute left-1/4 top-[4%] h-[38%] w-[42%] rounded-bl-[8%] rounded-br-[16%] rounded-tl-[70%] rounded-tr-[80%] bg-[linear-gradient(135deg,rgba(255,255,255,0.46),rgba(8,12,14,0.92))]" />
        <span className="absolute bottom-[20%] right-0 h-[48%] w-full rounded-bl-[22px] rounded-br-[18px] rounded-tl-[40px] rounded-tr-[80px] bg-[linear-gradient(135deg,#e8edf2,#15191d_34%,#020202_78%)] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.12)]" />
        <span className="absolute bottom-[42%] left-[8%] h-1 w-[18%] rounded-full bg-[#ff352e] shadow-[0_0_12px_rgba(255,53,46,0.85)]" />
        <span className="absolute bottom-[42%] right-[10%] h-1 w-[18%] rounded-full bg-[#cbe5ff] shadow-[0_0_14px_rgba(160,204,255,0.85)]" />
        <span className="absolute bottom-[7%] left-[16%] aspect-square w-[16%] rounded-full border-[6px] border-[#1b1b1b] bg-[radial-gradient(circle,#7c8288_0_22%,#151515_24%_100%)]" />
        <span className="absolute bottom-[7%] right-[12%] aspect-square w-[16%] rounded-full border-[6px] border-[#1b1b1b] bg-[radial-gradient(circle,#7c8288_0_22%,#151515_24%_100%)]" />
      </div>
    </div>
  );
}
