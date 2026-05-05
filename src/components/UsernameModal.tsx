import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function UsernameModal() {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setError('Username must be 3-20 characters, lowercase alphanumeric and underscores only');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.auth.checkUsername(username.trim().toLowerCase());
      if (result.success) {
        setUser({
          username: result.username,
          deploysToday: result.deploysToday || 0,
          credits: result.credits || 0,
          joinDate: result.joinDate || new Date().toISOString(),
        });
        toast.success(result.isNew ? 'Welcome! Account created.' : 'Welcome back!');
      } else {
        setError(result.error || 'Invalid username');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,15,0.95)] backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#1a1a25] border border-[#27273a] rounded-3xl p-12 max-w-[480px] w-full mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed20, #06b6d420)' }}
            >
              <User className="w-8 h-8 text-[#7c3aed]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">Enter Your Username</h2>
          <p className="text-[#94a3b8] text-center text-sm mb-8">
            Choose a unique username to start building and deploying websites.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="e.g., john_doe"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="h-12 bg-[#12121a] border-[#27273a] text-white placeholder:text-[#94a3b8]/50 focus:border-[#7c3aed] focus:ring-[#7c3aed]/20"
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-center gap-2 mt-2 text-red-400 text-xs"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:from-[#6d28d9] hover:to-[#0891b2] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Get Started'
              )}
            </Button>
          </form>

          <p className="text-[#94a3b8] text-xs text-center mt-6">
            3-20 characters, lowercase letters, numbers, and underscores only
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
