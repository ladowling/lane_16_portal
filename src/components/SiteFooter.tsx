import React from 'react';

export function SiteFooter() {
  return (
    <footer className="w-full bg-black py-8 border-t border-gray-900/50 mt-auto">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 px-6 text-center md:flex-row md:justify-between md:px-16">
        <div className="text-gray-400 text-sm font-medium tracking-wide">
          ©2026 Lane16. All Rights Reserved.
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <a href="mailto:support@lane16.com" className="text-gray-400 hover:text-green-500 transition-colors">
            support@lane16.com
          </a>
          <span className="text-gray-700">|</span>
          <a href="/#/privacy" className="text-gray-400 hover:text-green-500 transition-colors">
            Privacy Policy
          </a>
          <span className="text-gray-700">|</span>
          <a href="/#/terms" className="text-gray-400 hover:text-green-500 transition-colors">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
}
