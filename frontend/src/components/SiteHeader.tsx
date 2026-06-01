import { Button, Space } from 'antd';
import logo from '../assets/cars/lane16.png'

type SiteHeaderProps = {
  onHomeClick: () => void;
  onInventoryClick: () => void;
  onContactClick: () => void;
    onHowItWorksClick: () => void;
  
};

export function SiteHeader({ onHomeClick, onInventoryClick, onContactClick, onHowItWorksClick }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-1000 flex min-h-[76px] items-center justify-between bg-white px-16 text-[#050505] max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-2 max-[980px]:px-6 max-[980px]:py-3.5 max-[620px]:static">
    <img src={logo} alt="Logo" />
      <nav aria-label="Primary navigation">
        <Space size={28} className="max-[980px]:flex-wrap max-[620px]:!gap-3.5">
          <Button className="!h-auto !px-0 !py-1 !text-[23px] !font-bold !text-[#060606] hover:!bg-transparent hover:!text-lane-green max-[980px]:!text-lg" type="text" onClick={onHomeClick}>
            HOME
          </Button>
          <Button className="!h-auto !px-0 !py-1 !text-[23px] !font-bold !text-[#060606] hover:!bg-transparent hover:!text-lane-green max-[980px]:!text-lg" type="text" onClick={onInventoryClick}>
            INVENTORY
          </Button>
          <Button className="!h-auto !px-0 !py-1 !text-[23px] !font-bold !text-[#060606] hover:!bg-transparent hover:!text-lane-green max-[980px]:!text-lg" type="text" onClick={onHowItWorksClick}>
            HOW IT WORKS
          </Button>
          <Button className="!h-auto !px-0 !py-1 !text-[23px] !font-bold !text-[#060606] hover:!bg-transparent hover:!text-lane-green max-[980px]:!text-lg" type="text" onClick={onContactClick}>
            CONTACT
          </Button>
        </Space>
      </nav>
    </header>
  );
}
