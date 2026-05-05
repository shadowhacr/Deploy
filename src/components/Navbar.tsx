import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hexagon,
  Menu,
  X,
  LayoutGrid,
  HelpCircle,
  CreditCard,
  Shield,
  LogOut,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser, isAdmin, setIsAdmin, setAdminToken } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setAdminToken('');
    navigate('/');
  };

  const navLinks = [
    { label: 'Templates', href: '/templates', icon: LayoutGrid },
    { label: 'How It Works', href: '/#how-it-works', icon: HelpCircle },
    { label: 'Pricing', href: '/#pricing', icon: CreditCard },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return location.pathname === href;
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] h-[72px] flex items-center justify-between px-6 md:px-12"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(39, 39, 58, 0.5)',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <Hexagon className="w-7 h-7 text-[#7c3aed]" strokeWidth={2} />
        <span className="text-xl font-bold bg-clip-text text-transparent hidden sm:inline"
          style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          ShadowDeploy
        </span>
      </Link>

      {/* Center Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className={`text-sm font-medium transition-colors duration-300 ${
              isActive(link.href)
                ? 'text-[#7c3aed]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Credits Badge */}
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12121a] border border-[#27273a]">
            <Zap className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-xs font-medium">
              {2 - user.deploysToday > 0 ? (
                <span className="text-emerald-400">{2 - user.deploysToday}/2 Free</span>
              ) : (
                <span className="text-[#f59e0b]">{user.credits} Credits</span>
              )}
            </span>
          </div>
        )}

        {/* Admin Button */}
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="hidden md:flex items-center gap-2 text-[#94a3b8] hover:text-white"
          >
            <Shield className="w-4 h-4" />
            Admin
          </Button>
        )}

        {/* Username / Logout */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-[#94a3b8]">{user.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[#94a3b8] hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-[72px] right-0 w-72 bg-[#12121a] border border-[#27273a] rounded-xl p-4 md:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#94a3b8] hover:bg-[#1a1a25] hover:text-white transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#94a3b8] hover:bg-[#1a1a25] hover:text-white transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              {user && (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 text-sm text-[#94a3b8]">
                    <Zap className="w-4 h-4 text-[#f59e0b]" />
                    {user.username} — {user.credits} credits
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-[#1a1a25] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
