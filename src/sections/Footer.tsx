import { Link } from 'react-router-dom';
import { Hexagon, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#12121a] border-t border-[#27273a]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Tagline */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Hexagon className="w-6 h-6 text-[#7c3aed]" strokeWidth={2} />
              <span className="text-lg font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                ShadowDeploy
              </span>
            </Link>
            <p className="text-[#94a3b8] text-sm">Build websites in seconds</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-[#94a3b8] text-sm hover:text-white transition-colors">Home</Link>
              <Link to="/templates" className="text-[#94a3b8] text-sm hover:text-white transition-colors">Templates</Link>
              <Link to="/#pricing" className="text-[#94a3b8] text-sm hover:text-white transition-colors">Pricing</Link>
              <Link to="/#how-it-works" className="text-[#94a3b8] text-sm hover:text-white transition-colors">How It Works</Link>
            </div>
          </div>

          {/* Admin & Credits */}
          <div>
            <h4 className="font-semibold mb-4">Admin</h4>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-[#94a3b8] text-sm hover:text-white transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#27273a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#94a3b8] text-xs">
            © 2025 ShadowDeploy. All rights reserved.
          </p>
          <p className="text-[#94a3b8] text-xs">
            Powered by ShadowDeploy
          </p>
        </div>
      </div>
    </footer>
  );
}
