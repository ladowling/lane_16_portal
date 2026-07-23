type LogoPlaceholderProps = {
  onClick?: () => void;
};

export function LogoPlaceholder({ onClick }: LogoPlaceholderProps) {
  return (
    <button className="relative grid h-14 w-[156px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-lane-lime" type="button" aria-label="Lane16 home" onClick={onClick}>
      <span className="absolute left-5 top-[7px] h-6 w-[94px] rotate-[-8deg] rounded-t-[60%] border-t-[3px] border-lane-lime after:absolute after:right-[-30px] after:top-[-5px] after:h-4 after:w-[42px] after:rotate-[24deg] after:border-t-[3px] after:border-lane-lime after:content-['']" />
      <span className="relative z-[1] text-[28px] font-black italic leading-none">LANE1</span>
    </button>
  );
}
