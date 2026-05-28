import React from 'react';

export default function HowItWorksSeller() {
  return (
    <div className="bg-[#1a1a1a] min-h-screen text-gray-300 pb-24">
      <div className="bg-[#111] py-16 text-center border-b border-gray-800 mb-12">
        <h1 className="text-5xl font-bold text-white">How It Works for Sellers</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Intro Section */}
        <div className="bg-white text-black p-12 rounded-lg mb-12">
          <h2 className="text-3xl font-bold text-green-500 mb-6 leading-tight">
            A no-cost, no-pressure way to receive competitive dealer bids without going dealer to dealer
          </h2>
          <p className="text-lg mb-6 leading-relaxed">
            Lane16 connects private sellers with a network of approved licensed dealers who are looking for inventory. Instead of contacting multiple dealerships one by one, you submit your vehicle once and Lane16 presents it to approved dealers who may compete for the vehicle through the Lane16 bidding platform.
          </p>
          <p className="text-lg leading-relaxed">
            <strong>No seller cost:</strong> There is no cost to submit or list your vehicle with Lane16. If your vehicle sells, the seller does not owe any fee to Lane16. Lane16's buyer fee is paid by the purchasing dealer after a successful purchase.
          </p>
        </div>

        {/* Protection Card */}
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Your price protection</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            You set your Minimum Acceptable Sale Price, which is kept internal and is not shown to dealers. If bidding does not reach that amount, you are not required to sell.
          </p>
        </div>

        {/* Steps Container */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-8 md:p-12 space-y-8 mb-12">
          {[
            { title: "1. Submit Your Vehicle Information", desc: "Complete the Lane16 seller intake form with your contact information, VIN, year, make, model, mileage, title status, payoff or lien information, seller-reported condition, photos, and your Minimum Acceptable Sale Price." },
            { title: "2. Lane16 Reviews the Submission", desc: "Lane16 reviews the information before a vehicle is made visible to dealers. Not every vehicle submission is guaranteed to be listed. Lane16 may request clarification, additional photos, or updated information before approving a listing." },
            { title: "3. Approved Dealers Review and Bid", desc: "Once approved, your vehicle may be shown to approved dealers only. Dealers can review the photos and seller-reported vehicle information and submit bids through Lane16. Your seller floor and personal contact information are not displayed to dealers during bidding." },
            { title: "4. Seller Floor Protection", desc: "If bidding does not reach your Minimum Acceptable Sale Price, you are not required to sell. If bidding reaches or exceeds your Minimum Acceptable Sale Price, you are expected to proceed in good faith, subject to buyer verification and no material discrepancy in the information provided." },
            { title: "5. Winning Bid Identified", desc: "At the close of the listing period, the highest bid is identified as the winning bid. Lane16 will coordinate next steps between the seller and the winning dealer." },
            { title: "6. 72-Hour Inspection Arrangements", desc: "The seller and winning dealer must make arrangements for inspection within 72 hours of the auction end. Unless otherwise agreed by the parties, the seller is responsible for bringing the vehicle to the winning dealer's dealership or another mutually agreed inspection location." },
            { title: "7. Dealer Verification", desc: "The dealer may inspect and verify that the vehicle materially matches the information provided in the listing, including condition, title status, payoff or lien information, warning lights or codes, and other material representations. This period is not intended to create a general right to renegotiate after a valid bid." },
            { title: "8. Complete the Sale Directly", desc: "After inspection and verification, the buyer and seller complete the purchase directly with each other. Lane16 does not take possession of the vehicle and does not handle the vehicle purchase funds." },
          ].map((step, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="px-4">
          <h3 className="text-xl font-bold text-green-500 mb-3">Good Faith and Material Discrepancies</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Lane16 depends on accurate information and good-faith participation from both sellers and dealers. A dealer may decline to proceed only if there is a material discrepancy, such as undisclosed major damage, title issues, significant mechanical concerns, warning lights or codes not disclosed, payoff or lien information that is materially different from what was represented, or condition materially different from the listing.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Sellers are expected to disclose known material issues accurately. Sellers who submit inaccurate information or fail to proceed in good faith after their Minimum Acceptable Sale Price is met may be declined for future listings.
          </p>
        </div>
      </div>
    </div>
  );
}