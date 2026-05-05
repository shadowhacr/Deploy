import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { LayoutGrid, Pencil, Rocket, Link } from 'lucide-react';

const steps = [
  {
    icon: LayoutGrid,
    title: 'Choose',
    description: 'Browse 1000+ templates across 30+ categories. Find the perfect match for your project.',
  },
  {
    icon: Pencil,
    title: 'Customize',
    description: 'Edit text, images, colors, and buttons with our intuitive visual editor.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'One-click deployment with a unique URL. Your website goes live instantly.',
  },
  {
    icon: Link,
    title: 'Share',
    description: 'Get your live website link and share it with the world. No hosting needed.',
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="py-32 bg-[#0a0a0f]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <div className="w-24 h-1 mx-auto rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
          />
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative bg-[#12121a] border border-[#27273a] rounded-2xl p-8 hover:border-[#7c3aed]/30 transition-all duration-500 group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                {i + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#1a1a25] group-hover:bg-[#7c3aed]/10 transition-colors">
                <step.icon className="w-7 h-7 text-[#7c3aed]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
