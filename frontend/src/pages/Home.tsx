import { CheckCircle, Clock, DollarSign, Key, ArrowRight, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Hero Section */}
      <div className="relative w-full py-32 px-8 md:px-24 bg-gradient-to-r from-black via-black/90 to-transparent border-b border-gray-800 flex items-center">
        <div className="max-w-2xl z-10 relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-2 leading-tight">
            PRIVATE SELLER <br/> INVENTORY.
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-green-500 mb-8">
            BEFORE THE AUCTION.
          </h2>
          <div className="h-1 w-24 bg-green-600 mb-12"></div>
          
          <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 font-bold rounded flex items-center mb-6 transition-colors">
            VIEW INVENTORY <ArrowRight className="ml-2" size={20} />
          </button>
          <div className="flex items-center text-sm font-semibold tracking-wide">
            <Lock size={16} className="text-green-500 mr-2" />
            <span className="text-gray-300">DEALERS ONLY <span className="mx-3 text-gray-600">|</span> LOGIN TO ACCESS INVENTORY</span>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-800">
        {[
          { icon: CheckCircle, title: 'PRIVATE & VETTED', desc: 'Every vehicle is privately sourced and carefully vetted' },
          { icon: Clock, title: 'BEFORE THE AUCTION', desc: 'Get early access to inventory before it hits the auction' },
          { icon: DollarSign, title: 'REAL-TIME BIDDING', desc: 'Submit bids and see the current highest bid' },
          { icon: Key, title: 'DEALER ONLY', desc: 'Exclusive access for licensed dealers' }
        ].map((feature, idx) => (
          <div key={idx} className="p-8 border-r border-gray-800 last:border-0 flex items-start space-x-4">
            <feature.icon size={32} className="text-green-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm mb-2">{feature.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}