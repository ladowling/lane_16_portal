import { Button, Dropdown, Space } from 'antd';
import logo from '../assets/cars/lane16Logo.png';
import { useAuth } from '../Authontext';


type SiteHeaderProps = {
  onHomeClick: () => void;
  onInventoryClick: () => void;
  onContactClick: () => void;
  onHowItWorksClick: () => void;
  onHowItWorksSellerClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onDashboardClick: () => void;
  showDealerLogin?: boolean;
  showLogo?: boolean;
  activePage?: string;
};

export function SiteHeader({
  onHomeClick,
  onInventoryClick,
  onContactClick,
  onHowItWorksClick,
  onHowItWorksSellerClick,
  onLoginClick,
  onLogoutClick,
  onDashboardClick,
  showDealerLogin = false,
  showLogo = true,
  activePage,
}: SiteHeaderProps) {
  const { user } = useAuth();

  const baseNavClass = '!h-auto !px-0 !py-1 !text-[18px] !font-bold hover:!bg-transparent max-[980px]:!text-lg';
  const headerWidthClass = activePage === 'home' ? 'min-h-[70px]' : 'min-h-[92px] w-full';

  const getNavClass = (pageName: string) => {
    const isActive = activePage === pageName;
    return `${baseNavClass} ${isActive ? '!text-lane-green' : '!text-white hover:!text-lane-green'}`;
  };

  return (
    <header
      className={`sticky top-0 z-[1000] flex min-h-[92px] items-center w-full ${headerWidthClass} ${
        showLogo ? 'justify-between' : 'justify-end'
      } bg-black px-16 text-white max-[980px]:items-start max-[980px]:flex-col max-[980px]:gap-2 max-[980px]:px-6 max-[980px]:py-3.5`}
    >
      {showLogo && <img className="h-[150px] w-auto max-[980px]:h-16" src={logo} alt="Logo" />}

      <nav aria-label="Primary navigation">
        <Space size={28} className="max-[980px]:flex-wrap max-[620px]:!gap-3.5">
          {/* Always-visible public links */}
          <Button className={getNavClass('home')} type="text" onClick={onHomeClick}>
            HOME
          </Button>

          <Dropdown
            menu={{
              items: [
                { key: 'dealer', label: 'Dealer', onClick: onHowItWorksClick },
                { key: 'seller', label: 'Sellers', onClick: onHowItWorksSellerClick },
              ],
            }}
          >
            <Button className={getNavClass('howItWorks')} type="text">
              HOW IT WORKS
            </Button>
          </Dropdown>

          <Button className={getNavClass('contact')} type="text" onClick={onContactClick}>
            CONTACT
          </Button>

          {/* Dealer-only link */}
          {user?.role === 'dealer' && (
            <Button className={getNavClass('inventory')} type="text" onClick={onInventoryClick}>
              INVENTORY
            </Button>
          )}

          {/* Admin-only link */}
          {user?.role === 'admin' && (
            <Button className={getNavClass('dashboard')} type="text" onClick={onDashboardClick}>
              DASHBOARD
            </Button>
          )}

          {/* Unauthenticated: show Dealer Login CTA on home, or plain Login elsewhere */}
          {!user && showDealerLogin && (
            <Button
              className="!h-auto !border-lane-green !bg-transparent !px-4 !py-1.5 !text-[20px] !font-bold !text-lane-green hover:!border-lane-green hover:!bg-transparent hover:!text-white max-[980px]:!text-base"
              onClick={onLoginClick}
            >
              Dealer Login
            </Button>
          )}

          {/* Authenticated: logout */}
          {user && (
            <Button
              className="!h-auto !border-[#575757] !bg-transparent !px-4 !py-1.5 !text-[18px] !font-bold !text-[#c8c8c8] hover:!border-white hover:!text-white max-[980px]:!text-base"
              onClick={onLogoutClick}
            >
              Logout
            </Button>
          )}
        </Space>
      </nav>
    </header>
  );
}