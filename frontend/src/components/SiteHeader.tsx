import { Button, Space } from 'antd';
import { LogoPlaceholder } from './LogoPlaceholder';

type SiteHeaderProps = {
  onInventoryClick: () => void;
};

export function SiteHeader({ onInventoryClick }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <LogoPlaceholder />
      <nav aria-label="Primary navigation">
        <Space size={28} className="nav-links">
          <Button type="text" onClick={onInventoryClick}>
            INVENTORY
          </Button>
          <Button type="text">HOW IT WORKS</Button>
          <Button type="text">CONTACT</Button>
        </Space>
      </nav>
    </header>
  );
}
