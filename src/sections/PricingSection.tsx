import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Renewed every 24 hours',
    features: ['2 daily deploys', 'Access to all 1000+ templates', 'Basic customization', 'Unique URL'],
    cta: 'Get Started',
    popular: false,
    id: null,
  },
  {
    name: 'Starter',
    price: '$9.99',
    description: 'One-time purchase',
    features: ['10 deploy credits', 'Access to all 1000+ templates', 'Full customization', 'Unique URL', 'Priority support'],
    cta: 'Buy Now',
    popular: true,
    id: 'starter',
  },
  {
    name: 'Pro',
    price: '$29.99',
    description: 'Best value',
    features: ['50 deploy credits', 'Access to all 1000+ templates', 'Full customization', 'Unique URL', 'Priority support', 'No expiration'],
    cta: 'Buy Now',
    popular: false,
    id: 'pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For agencies',
    features: ['Unlimited deploys', 'All Pro features', 'Custom templates', 'Dedicated support', 'White-label option'],
    cta: 'Contact Admin',
    popular: false,
    id: 'enterprise',
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { user } = useStore();

  const handlePurchase = async (planId: string | null) => {
    if (!user) {
      toast.error('Please enter your username first');
      return;
    }
    if (!planId) {
      toast.info('You already have 2 free daily deploys!');
      return;
    }
    if (planId === 'enterprise') {
      toast.info('Please contact admin via WhatsApp or Telegram');
      return;
    }
    try {
      const result = await api.credits.purchase(user.username, planId);
      if (result.success) {
        toast.success(result.message);
        // Refresh user data
        const userData = await api.auth.getUser(user.username);
        if (userData.success) {
          useStore.getState().setUser({
            ...user,
            credits: userData.credits,
          });
        }
      }
    } catch {
      toast.error('Purchase failed. Please try again.');
    }
  };

  return (
    <section id="pricing" className="py-32 bg-[#0a0a0f]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Deployment Credits</h2>
          <p className="text-[#94a3b8] max-w-[500px] mx-auto">
            2 free deployments daily. Need more? Purchase credits.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative bg-[#12121a] border rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? 'border-[#7c3aed] scale-105 shadow-[0_0_30px_rgba(124,58,237,0.15)]'
                  : 'border-[#27273a]'
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                {plan.price}
              </div>
              <p className="text-[#94a3b8] text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[#94a3b8]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(plan.id)}
                className={`w-full h-11 rounded-xl font-semibold ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white hover:from-[#6d28d9] hover:to-[#0891b2]'
                    : 'bg-[#1a1a25] text-white hover:bg-[#27273a] border border-[#27273a]'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Admin Contact */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[#94a3b8] text-sm mb-4">Need custom credits? Contact Admin</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-[#27273a] text-[#94a3b8] hover:text-emerald-400 hover:border-emerald-400/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href="https://t.me/shadowadmin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-[#27273a] text-[#94a3b8] hover:text-[#06b6d4] hover:border-[#06b6d4]/30 transition-colors"
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
