import { Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import logo from '../assets/cars/lane16Logo.png';
import { useAuth } from '../Authontext';
import { ChangePasswordModal } from './ChangePasswordModal';


type SiteHeaderProps = {
  onHomeClick: () => void;
  onVehicleClick: () => void;
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
  onVehicleClick,
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
  const { token, user } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const baseNavClass = '!h-auto !px-0 !py-1 !text-[18px] !font-bold hover:!bg-transparent max-[980px]:!text-lg';
  const headerWidthClass = activePage === 'home' ? 'min-h-[70px]' : 'min-h-[92px] w-full';

  const getNavClass = (pageName: string) => {
    const isActive = activePage === pageName;
    return `${baseNavClass} ${isActive ? '!text-lane-green' : '!text-white hover:!text-lane-green'}`;
  };
  const accountName = user?.name || user?.email?.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase()) || 'User Account';
  const accountRole = user?.role === 'admin' ? 'Admin' : user?.role === 'staff' ? 'Staff' : 'Dealer';
  const accountInitials = accountName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <>
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

          <Button className={getNavClass('submitVehicle')} type="text" onClick={onVehicleClick}>
            VEHICLE
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
          {(user?.role === 'admin' || user?.role === 'staff') && (
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

          {/* Authenticated: profile menu */}
          {user && (
            <Dropdown
              menu={{
                items: [
                  { key: 'change-password', label: 'Change Password', onClick: () => setIsChangePasswordOpen(true) },
                  { key: 'logout', label: 'Log Out', danger: true, onClick: onLogoutClick },
                ],
              }}
              trigger={['click']}
            >
              <Button className="!h-auto !border !border-[#575757] !bg-black !px-3 !py-2 !text-left !shadow-none hover:!border-[#24d725] hover:!bg-black">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#123414] text-xs font-bold text-[#24d725]">
                    {accountInitials}
                  </span>
                  <span className="min-w-[130px]">
                    <span className="block text-sm font-bold leading-5 text-white">{accountName}</span>
                    <span className="block text-xs leading-4 text-[#c8c8c8]">{accountRole}</span>
                  </span>
                  <DownOutlined className="text-sm !text-[#24d725]" />
                </span>
              </Button>
            </Dropdown>
          )}
        </Space>
      </nav>
    </header>
      <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} token={token} />
    </>
  );
}
