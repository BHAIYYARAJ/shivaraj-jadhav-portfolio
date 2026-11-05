import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ContactInfo, SocialLink } from '../types/portfolio.js';
import { api } from '../services/api.js';
import { MagneticButton } from './animations/MagneticButton.js';

interface ContactSectionProps {
  contactInfo: ContactInfo;
  socials: SocialLink[];
  prefilledService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactInfo,
  socials,
  prefilledService,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceRequested: prefilledService || 'Cinematic Video Editing',
    budget: 'Flexible',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update prefilled service if prop changes
  React.useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({ ...prev, serviceRequested: prefilledService }));
    }
  }, [prefilledService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.submitContact(formData);
      setSuccessMessage(res.message || 'Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceRequested: 'Cinematic Video Editing',
        budget: 'Flexible',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (p.includes('whatsapp')) return <MessageCircle className="w-4 h-4" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const handleWhatsAppClick = () => {
    const rawNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const defaultText = encodeURIComponent(
      `Hello Shivaraj, I came across your editing portfolio and would like to discuss a project!`
    );
    window.open(`https://wa.me/${rawNumber}?text=${defaultText}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-[#08080a] dark:bg-[#08080a] light:bg-stone-50 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
            Start A Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-zinc-900 font-heading">
            Let&apos;s Create Visual Magic Together
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-base leading-relaxed">
            Have a commercial campaign, wedding teaser, viral reel, or photo series in mind? Drop a message or reach out directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Social channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white dark:text-white light:text-zinc-900 font-heading">
                Direct Contact &amp; Availability
              </h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed">
                I take on a limited number of high-touch editing and retouching projects each month to guarantee pristine quality.
              </p>
            </div>

            {/* Direct channel cards */}
            <div className="space-y-4">
              {/* WhatsApp instant CTA */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 dark:from-emerald-950/40 dark:to-zinc-900 light:from-emerald-50 light:to-white border border-emerald-500/40 hover:border-emerald-500/80 transition-all flex items-center justify-between text-left group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-500 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
                      Fastest Response
                    </span>
                    <span className="text-base font-bold text-white dark:text-white light:text-zinc-900">Chat on WhatsApp</span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-500 block">{contactInfo.whatsapp}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Chat Now &rarr;
                </span>
              </button>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-orange-600/15 text-orange-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-500 font-medium">Direct Email</span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm sm:text-base font-bold text-white dark:text-white light:text-zinc-900 hover:text-orange-500 transition-colors block break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-orange-600/15 text-orange-500 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-500 font-medium">Direct Call</span>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-base font-bold text-white dark:text-white light:text-zinc-900 hover:text-orange-500 transition-colors block"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Location & Response Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-400 light:text-zinc-500 text-xs mb-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>Location</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{contactInfo.address}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-400 light:text-zinc-500 text-xs mb-1">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Turnaround</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{contactInfo.responseTime}</p>
                </div>
              </div>
            </div>

            {/* Social channels bar */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase tracking-wider block">
                Social Profiles &amp; Showcases
              </span>
              <div className="flex flex-wrap gap-2.5">
                {socials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-orange-500 hover:border-orange-500/50 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-50 transition-all text-xs font-medium shadow-sm"
                  >
                    {getSocialIcon(soc.platform)}
                    <span>{soc.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white border border-zinc-800/90 dark:border-zinc-800/90 light:border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white dark:text-white light:text-zinc-900 mb-2 font-heading">
              Send a Project Inquiry
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-6">
              Fill out the details below. I review every submission personally and respond within 12 hours.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 dark:bg-emerald-950/60 light:bg-emerald-50 border border-emerald-500/50 flex items-center gap-3 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <p>{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 dark:bg-red-950/60 light:bg-red-50 border border-red-500/50 flex items-center gap-3 text-red-300 dark:text-red-300 light:text-red-800 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1.5">
                    Your Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl px-4 py-3 text-sm text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1.5">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl px-4 py-3 text-sm text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl px-4 py-3 text-sm text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1.5">
                    Service Required
                  </label>
                  <select
                    value={formData.serviceRequested}
                    onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl px-4 py-3 text-sm text-white dark:text-white light:text-zinc-900 focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="Cinematic Video Editing">Cinematic Video Editing</option>
                    <option value="High-End Photo Retouching">High-End Photo Retouching</option>
                    <option value="Color Grading & Film Look">Color Grading & Film Look</option>
                    <option value="Reels & Shorts Viral Edits">Reels & Shorts Viral Edits</option>
                    <option value="Wedding Film Post-Production">Wedding Film Post-Production</option>
                    <option value="Motion Graphics & VFX">Motion Graphics & VFX</option>
                    <option value="Complete Production Package">Complete Production Package</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1.5">
                  Estimated Budget
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl px-4 py-3 text-sm text-white dark:text-white light:text-zinc-900 focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="Flexible">Flexible / Discuss on Call</option>
                  <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000 ($200 - $400)</option>
                  <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000 ($400 - $900)</option>
                  <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000 ($900 - $1800)</option>
                  <option value="₹1,50,000+">₹1,50,000+ ($1800+ Commercial)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1.5">
                  Project Brief &amp; Details <span className="text-orange-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, target platform, raw footage format, and creative vision..."
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl px-4 py-3 text-sm text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span>Sending Your Inquiry...</span>
                ) : (
                  <>
                    <span>Send Project Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
