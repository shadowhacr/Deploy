import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Wrench,
  LogOut,
  Loader2,
  Globe,
  CreditCard,
  BarChart3,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin, adminToken, setAdminToken } = useStore();
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (adminToken) {
      setIsAdmin(true);
      loadDashboardData();
    }
  }, [adminToken]);

  const handleLogin = async () => {
    if (!password) return;
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await api.admin.login(password);
      if (result.success) {
        setAdminToken(result.token);
        setIsAdmin(true);
        toast.success('Admin login successful');
      } else {
        setLoginError(result.error || 'Invalid password');
      }
    } catch {
      setLoginError('Server error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadDashboardData = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const [statsData, usersData, templatesData, settingsData] = await Promise.all([
        api.admin.getStats(adminToken),
        api.admin.getUsers(adminToken),
        api.admin.getTemplates(adminToken),
        api.admin.getSettings(adminToken),
      ]);
      setStats(statsData);
      setUsers(usersData.users || []);
      setTemplates(templatesData.templates || []);
      setSettings(settingsData);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreditUpdate = async (action: 'add' | 'remove') => {
    if (!adminToken || !selectedUser || !creditAmount) return;
    try {
      const result = await api.admin.updateCredits(adminToken, selectedUser, parseInt(creditAmount), action);
      if (result.success) {
        toast.success(result.message);
        loadDashboardData();
        setCreditAmount('');
        setSelectedUser('');
      }
    } catch {
      toast.error('Failed to update credits');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!adminToken) return;
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.admin.deleteTemplate(adminToken, id);
      toast.success('Template deleted');
      loadDashboardData();
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const handleSaveSettings = async () => {
    if (!adminToken || !settings) return;
    try {
      await api.admin.updateSettings(adminToken, {
        siteTitle: settings.siteTitle,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
        contactInfo: settings.contactInfo,
      });
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleChangePassword = async () => {
    if (!adminToken || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.admin.changePassword(adminToken, password, newPassword);
      toast.success('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to change password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminToken('');
    navigate('/');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  const chartData = stats?.deploymentsThisWeek?.map((value: number, i: number) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    deploys: value,
  })) || [];

  // Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          className="bg-[#1a1a25] border border-[#27273a] rounded-3xl p-10 max-w-[400px] w-full mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#7c3aed]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Admin Panel</h2>
          <p className="text-[#94a3b8] text-center text-sm mb-6">Enter admin password to continue</p>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12 bg-[#12121a] border-[#27273a] text-white pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <motion.p
                className="text-red-400 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {loginError}
              </motion.p>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold rounded-xl"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex pt-[72px]">
      {/* Sidebar */}
      <div className="w-60 bg-[#12121a] border-r border-[#27273a] flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Shield className="w-5 h-5 text-[#7c3aed]" />
            <span className="font-bold">Admin</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#7c3aed]/20 text-[#7c3aed]'
                    : 'text-[#94a3b8] hover:bg-[#1a1a25] hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors mt-8"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Dashboard */}
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#7c3aed' },
                    { label: 'Total Deployments', value: stats?.totalDeployments || 0, icon: Globe, color: '#06b6d4' },
                    { label: 'Templates', value: stats?.totalTemplates || 0, icon: FileText, color: '#f59e0b' },
                    { label: 'Credits Sold', value: stats?.creditsSold || 0, icon: CreditCard, color: '#10b981' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#12121a] border border-[#27273a] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#94a3b8] text-sm">{stat.label}</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                          <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#7c3aed]" />
                    Deployments This Week
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27273a" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{ background: '#1a1a25', border: '1px solid #27273a', borderRadius: '8px' }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Line type="monotone" dataKey="deploys" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Templates */}
            {activeSection === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Templates</h1>
                  <span className="text-[#94a3b8] text-sm">{templates.length} templates</span>
                </div>

                <div className="bg-[#12121a] border border-[#27273a] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#27273a]">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">ID</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Category</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Deploys</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.slice(0, 50).map((t) => (
                          <tr key={t.id} className="border-b border-[#27273a]/50 hover:bg-[#1a1a25]">
                            <td className="px-4 py-3 text-sm font-mono text-[#94a3b8]">{t.id}</td>
                            <td className="px-4 py-3 text-sm">{t.name}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-[#1a1a25] text-[#94a3b8]">
                                {t.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#94a3b8]">{t.deployCount}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDeleteTemplate(t.id)}
                                className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users */}
            {activeSection === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold mb-6">Users</h1>

                {/* Credit Management */}
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">Manage Credits</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="h-10 px-3 rounded-lg bg-[#0a0a0f] border border-[#27273a] text-white text-sm focus:border-[#7c3aed] outline-none"
                    >
                      <option value="">Select user...</option>
                      {users.map((u) => (
                        <option key={u.username} value={u.username}>{u.username}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder="Credits amount"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="h-10 bg-[#0a0a0f] border-[#27273a] text-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCreditUpdate('add')}
                        disabled={!selectedUser || !creditAmount}
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Add Credits
                      </Button>
                      <Button
                        onClick={() => handleCreditUpdate('remove')}
                        disabled={!selectedUser || !creditAmount}
                        variant="outline"
                        className="h-10 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#27273a]">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Username</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Deploys Today</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Credits</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Total Deploys</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.username} className="border-b border-[#27273a]/50 hover:bg-[#1a1a25]">
                            <td className="px-4 py-3 text-sm font-medium">{u.username}</td>
                            <td className="px-4 py-3 text-sm text-[#94a3b8]">{u.deploysToday}/2</td>
                            <td className="px-4 py-3 text-sm text-[#f59e0b]">{u.credits}</td>
                            <td className="px-4 py-3 text-sm text-[#94a3b8]">{u.totalDeploys}</td>
                            <td className="px-4 py-3 text-sm text-[#94a3b8]">
                              {new Date(u.joinDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings */}
            {activeSection === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                {/* Site Settings */}
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">Site Settings</h3>
                  <div className="space-y-4 max-w-[500px]">
                    <div>
                      <label className="text-sm text-[#94a3b8] mb-1 block">Site Title</label>
                      <Input
                        value={settings?.siteTitle || ''}
                        onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                        className="bg-[#0a0a0f] border-[#27273a] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] mb-1 block">WhatsApp Number</label>
                      <Input
                        value={settings?.contactInfo?.whatsapp || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: { ...settings?.contactInfo, whatsapp: e.target.value }
                        })}
                        className="bg-[#0a0a0f] border-[#27273a] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] mb-1 block">Telegram Handle</label>
                      <Input
                        value={settings?.contactInfo?.telegram || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: { ...settings?.contactInfo, telegram: e.target.value }
                        })}
                        className="bg-[#0a0a0f] border-[#27273a] text-white"
                      />
                    </div>
                    <Button onClick={handleSaveSettings} className="bg-[#7c3aed] hover:bg-[#6d28d9]">
                      <Save className="w-4 h-4 mr-2" /> Save Settings
                    </Button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Change Admin Password</h3>
                  <div className="space-y-4 max-w-[500px]">
                    <div>
                      <label className="text-sm text-[#94a3b8] mb-1 block">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-[#0a0a0f] border-[#27273a] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] mb-1 block">Confirm Password</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-[#0a0a0f] border-[#27273a] text-white"
                      />
                    </div>
                    <Button onClick={handleChangePassword} className="bg-[#7c3aed] hover:bg-[#6d28d9]">
                      Change Password
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Maintenance */}
            {activeSection === 'maintenance' && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold mb-6">Maintenance Mode</h1>

                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-6 max-w-[500px]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold">Enable Maintenance Mode</h3>
                      <p className="text-sm text-[#94a3b8]">Show maintenance message to visitors</p>
                    </div>
                    <Switch
                      checked={settings?.maintenanceMode || false}
                      onCheckedChange={(checked) => {
                        setSettings({ ...settings, maintenanceMode: checked });
                      }}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="text-sm text-[#94a3b8] mb-1 block">Maintenance Message</label>
                    <textarea
                      value={settings?.maintenanceMessage || ''}
                      onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#27273a] text-white text-sm focus:border-[#7c3aed] outline-none resize-none"
                    />
                  </div>

                  <Button onClick={handleSaveSettings} className="bg-[#7c3aed] hover:bg-[#6d28d9]">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
