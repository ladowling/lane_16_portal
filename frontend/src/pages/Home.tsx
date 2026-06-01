import { ArrowRight, CheckCircle, Clock, Lock, Mail } from 'lucide-react';
import handshake from '../assets/cars/HandshakeOutline.png';
import dollar from '../assets/cars/dollarSign.png';
import homeBgImage from '../assets/cars/HomeBgImage.png';
import logo from '../assets/cars/logo2.png'

interface HomeProps {
  onSellVehicleClick?: () => void;
}

export default function Home({ onSellVehicleClick }: HomeProps) {
  const features = [
    {
      icon: <CheckCircle size={26} className="shrink-0 text-green-500" />,
      title: 'PRIVATE & VETTED',
      desc: 'Every vehicle is privately sourced and carefully vetted',
    },
    {
      icon: <Clock size={26} className="shrink-0 text-green-500" />,
      title: 'BEFORE THE AUCTION',
      desc: 'Get early access to inventory before it hits the auction',
    },
    {
      icon: <img className="h-[26px] w-[26px] shrink-0 object-contain" src={dollar} alt="" />,
      title: 'REAL-TIME BIDDING',
      desc: 'Submit bids and see the current highest bid',
    },
    {
      icon: <img className="h-[26px] w-[26px] shrink-0 object-contain" src={handshake} alt="" />,
      title: 'DEALER ONLY',
      desc: 'Exclusive access for licensed dealers',
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#111] bg-contain bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.88), rgba(0,0,0,0.68), rgba(0,0,0,0.38)), url(${homeBgImage})` }}
    >
      {/* Hero Section */}
      <div className="relative flex w-full items-center border-b border-gray-800 px-6 py-16 md:px-20 md:py-20">
        <div className="relative z-10 max-w-2xl">
          <img className="h-[150px] w-auto mb-4" src={logo} alt="Logo" />
          <h1 className="mb-2 text-4xl font-bold md:text-6xl">
            PRIVATE SELLER INVENTORY.
          </h1>
          <h2 className="mb-5 text-4xl font-bold text-green-500 md:text-6xl">
            BEFORE THE AUCTION.
          </h2>
          <div className="mb-7 h-1 w-20 bg-green-600"></div>
          <div className="flex flex-row flex-wrap gap-3">
            <button className="mb-4 flex items-center rounded bg-green-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-500">
              Dealer Access <ArrowRight className="ml-2" size={18} />
            </button>
            <button onClick={onSellVehicleClick} className="mb-4 flex items-center rounded bg-green-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-500">
              Sell Your Vehicle <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
          <div className="flex items-center text-xs font-semibold tracking-wide">
            <Lock size={15} className="mr-2 text-green-500" />
            <span className="text-gray-300">DEALERS ONLY <span className="mx-3 text-gray-600">|</span> LOGIN TO ACCESS INVENTORY</span>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="grid grid-cols-1 border-b border-gray-800 bg-black/80 md:grid-cols-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3 border-r border-gray-800 p-5 last:border-0">
            {feature.icon}
            <div>
              <h4 className="mb-1.5 text-sm font-bold">{feature.title}</h4>
              <p className="text-xs leading-relaxed text-gray-400">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-black py-16 text-center border-t border-gray-900/50">
        <h3 className="text-green-500 text-xl font-bold tracking-wide mb-2">HAVE QUESTIONS?</h3>
        <p className="text-gray-300 text-base mb-8">We're here to help you</p>
        
        <button className="border border-green-600/80 text-green-500 font-semibold px-14 py-3 bg-transparent hover:bg-green-950/30 transition-all tracking-wide mb-6">
          CONTACT US
        </button>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-white font-medium mb-12">
          <Mail size={18} className="text-green-500" />
          <span>Support@Lane16.com.</span>
        </div>
        
        <p className="text-gray-600 text-xs tracking-widest font-semibold">
          ©2026 LANE16. ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}
