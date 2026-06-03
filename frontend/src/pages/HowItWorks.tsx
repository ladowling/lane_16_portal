import mercedes from '../assets/cars/mercedes4.png'

export default function HowItWorks() {
  return (
    <div className="bg-[#1a1a1a] min-h-screen text-gray-300">
      <div className="bg-[#111] py-16 text-center border-b border-gray-800">
        <h1 className="text-5xl font-bold text-white mb-4">How It Works for Dealers</h1>
        <p className="text-gray-400 text-lg">Private Seller Inventory. Before the Auction.</p>
      </div>

      <div className="max-w-[1450px] mx-auto py-16 px-6">
        {/* Introduction Card */}
        <div className="bg-white text-black p-12 rounded-lg flex flex-col md:flex-row items-center mb-12 max-w-[1000px] mx-auto">
          <div className="md:w-1/2 pr-8">
            <h2 className="text-3xl font-bold text-green-500 mb-6">Dealer Access Only</h2>
            <p className="text-lg mb-6 leading-relaxed">
              Lane16 is a private, dealer-only platform for sourcing private seller inventory before it reaches traditional auction channels.
            </p>
            <p className="text-lg leading-relaxed">Access is limited to approved dealers only.</p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 p-4  flex items-center justify-center min-h-[250px]">
             {/* Placeholder for Car Graphic */}
             <div ><img className="h-[300px] w-auto object-contain" src={mercedes} alt="Car Graphic" />

             </div>
          </div>
        </div>

        {/* Steps Container */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-8 md:p-12 space-y-8">
          {[
            { title: "1. Review Available Inventory", desc: "Approved dealers can log in to view available vehicles, photos, seller-reported condition information, and current bidding activity." },
            { title: "2. Place Bids", desc: "Dealers may place bids directly through the Lane16 portal. The current highest bid will be visible, and dealers may continue bidding until the listing deadline." },
            { title: "3. Highest Bid Wins", desc: "At the close of the listing period, the highest bid is identified as the winning bid." },
            { title: "4. 72-Hour Verification and Inspection", desc: "Winning bidders are expected to proceed in good faith after a reasonable inspection of the vehicle. The winning dealer and seller must make arrangements for inspection within 72 hours of the auction end. Unless otherwise agreed by the parties, the seller is responsible for bringing the vehicle to the winning dealer's dealership or another mutually agreed inspection location. The purpose of this, is to verify that the vehicle materially matches the information provided in the listing, including condition and material representations. This verification period is not intended to create a general right to renegotiate or walk away." },
            { title: "5. Good Faith Commitment", desc: "Lane16 depends on serious, good-faith participation from both buyers and sellers. Dealers who repeatedly win bids and fail to complete purchases without valid material cause may be removed from the Lane16 portal." },
            { title: "6. Complete the Purchase", desc: "After inspection and verification, the buyer and seller complete the transaction directly. Lane16 does not take possession of the vehicle and does not handle the vehicle purchase funds." },
            { title: "7. Lane16 Buyer Fee", desc: "A $500 buyer fee is due to Lane16 after the successful purchase of a vehicle." },
          ].map((step, idx) => (
            <div key={idx}>
              <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-base leading-relaxed text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 px-4">
          <h3 className="text-2xl font-bold text-green-500 mb-3">Material Discrepancies</h3>
          <p className="text-base text-gray-400 leading-relaxed">
            A buyer may decline to proceed only if there is a material discrepancy, such as undisclosed major damage, title issues, significant mechanical concerns, warning lights or codes not disclosed, or condition materially different from what was represented.
          </p>
        </div>
      </div>
    </div>
  );
}