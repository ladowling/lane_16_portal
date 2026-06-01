import { Button, Dropdown, Space } from 'antd';
import logo from '../assets/cars/logo2.png'

type SiteHeaderProps = {
  onHomeClick: () => void;
  onInventoryClick: () => void;
  onContactClick: () => void;
  onHowItWorksClick: () => void;
  onHowItWorksSellerClick: () => void;
  showDealerLogin?: boolean;    
  showLogo?: boolean;
};

export function SiteHeader({ onHomeClick, onInventoryClick, onContactClick, onHowItWorksClick, onHowItWorksSellerClick, showDealerLogin = false, showLogo = true }: SiteHeaderProps) {
  const navButtonClass = '!h-auto !px-0 !py-1 !text-[18px] !font-bold !text-white hover:!bg-transparent hover:!text-lane-green max-[980px]:!text-lg';

  return (
    <header className={`sticky top-0 z-[1000] flex min-h-[92px] items-center ${showLogo ? 'justify-between' : 'justify-end'} bg-black px-16 text-white max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-2 max-[980px]:px-6 max-[980px]:py-3.5`}>
      {showLogo && <img className="h-[150px] w-auto max-[980px]:h-16" src={logo} alt="Logo" />}
      <nav aria-label="Primary navigation">
        <Space size={28} className="max-[980px]:flex-wrap max-[620px]:!gap-3.5">
          <Button className={navButtonClass} type="text" onClick={onHomeClick}>
           HOME
          </Button>
          <Button className={navButtonClass} type="text" onClick={onInventoryClick}>
            INVENTORY
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: 'dealer', label: 'Dealer', onClick: onHowItWorksClick },
                { key: 'seller', label: 'Sellers', onClick: onHowItWorksSellerClick },
              ],
            }}
          >
            <Button className={navButtonClass} type="text">
             HOW IT WORKS
            </Button>
          </Dropdown>
          <Button className={navButtonClass} type="text" onClick={onContactClick}>
            CONTACT
          </Button>
          {showDealerLogin && (
            <Button
              className="!h-auto !border-lane-green !bg-transparent !px-4 !py-1.5 !text-[20px] !font-bold !text-lane-green hover:!border-lane-green hover:!bg-transparent hover:!text-white max-[980px]:!text-base"
              onClick={onInventoryClick}
            >
              Dealer Login
            </Button>
          )}
        </Space>
      </nav>
    </header>
  );
}
