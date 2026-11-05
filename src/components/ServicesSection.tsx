import React from 'react';
import {
  Film,
  Camera,
  Sparkles,
  Smartphone,
  Heart,
  Layers,
  Check,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ServiceItem } from '../types/portfolio.js';
import { TiltCard } from './animations/TiltCard.js';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  const getServiceIcon = (name: string, fallback: string) => {
    const key = (name || fallback).toLowerCase();
    if (key.includes('film') || key.includes('video')) return <Film className="w-6 h-6 text-orange-500" />;
    if (key.includes('camera') || key.includes('photo') || key.includes('retouch')) return <Camera className="w-6 h-6 text-orange-500" />;
    if (key.includes('sparkle') || key.includes('color') || key.includes('grade')) return <Sparkles className="w-6 h-6 text-orange-500" />;
    if (key.includes('smartphone') || key.includes('reel') || key.includes('short')) return <Smartphone className="w-6 h-6 text-orange-500" />;
    if (key.includes('heart') || key.includes('wedding')) return <Heart className="w-6 h-6 text-orange-500" />;
    return <Layers className="w-6 h-6 text-orange-500" />;
  };

  return (
    <section id="services" className="py-24 bg-[#09090b] dark:bg-[#09090b] light:bg-white relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
            Services &amp; Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-zinc-900 font-heading">
            Tailored Post-Production Excellence
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-base leading-relaxed">
            From raw rushes to viral delivery, discover dedicated editing services crafted for creators, brands, and agencies.
          </p>
        </motion.div>

        {/* Services Cards Grid with 3D Tilt and Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <TiltCard maxTilt={6} glare={true} className="h-full">
                <div
                  className={`h-full relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 border ${
                    service.highlight
                      ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 dark:from-zinc-900 dark:to-zinc-950 light:from-white light:via-orange-50/30 light:to-white border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.12)]'
                      : 'bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-stone-50 border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  {service.highlight && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-extrabold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md z-10">
                      Signature Craft
                    </div>
                  )}

                  <div>
                    {/* Icon box */}
                    <div className="w-12 h-12 rounded-xl bg-orange-600/10 dark:bg-orange-600/10 light:bg-orange-100 border border-orange-500/30 dark:border-orange-500/30 light:border-orange-300 flex items-center justify-center mb-5">
                      {getServiceIcon(service.iconName, service.title)}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-zinc-900 mb-3 font-heading">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Deliverables checklist */}
                    {service.deliverables && service.deliverables.length > 0 && (
                      <div className="space-y-2 mb-8 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 pt-5">
                        {service.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
                            <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full mt-auto inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-zinc-900 dark:bg-zinc-900 light:bg-white hover:bg-orange-600 dark:hover:bg-orange-600 light:hover:bg-orange-600 text-zinc-200 dark:text-zinc-200 light:text-zinc-800 hover:text-white dark:hover:text-white light:hover:text-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-orange-500 transition-all group shadow-sm"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
