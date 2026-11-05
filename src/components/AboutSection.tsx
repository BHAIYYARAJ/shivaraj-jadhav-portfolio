import React, { useState } from 'react';
import {
  Download,
  Film,
  Sparkles,
  Sliders,
  Layers,
  Award,
  Video,
  Palette,
  Image,
  Camera,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProfileData, SkillItem } from '../types/portfolio.js';
import { TiltCard } from './animations/TiltCard.js';
import { MagneticButton } from './animations/MagneticButton.js';

interface AboutSectionProps {
  profile: ProfileData;
  skills: SkillItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, skills }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Software' | 'Specialty'>('All');

  const filteredSkills = skills.filter((sk) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Software') return sk.category === 'Software';
    return sk.category !== 'Software';
  });

  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('premiere') || n.includes('video')) return <Video className="w-4 h-4 text-orange-500" />;
    if (n.includes('resolve') || n.includes('palette') || n.includes('color')) return <Palette className="w-4 h-4 text-orange-500" />;
    if (n.includes('effects') || n.includes('motion')) return <Sparkles className="w-4 h-4 text-orange-500" />;
    if (n.includes('photoshop') || n.includes('image')) return <Image className="w-4 h-4 text-orange-500" />;
    if (n.includes('lightroom') || n.includes('camera')) return <Camera className="w-4 h-4 text-orange-500" />;
    return <Sliders className="w-4 h-4 text-orange-500" />;
  };

  const handleDownloadCv = () => {
    if (profile.cvUrl) {
      window.open(profile.cvUrl, '_blank');
    } else {
      const resumeContent = `SHIVARAJ JADHAV — Creative Video & Photo Editor
Email: jadhavbhaiyyaraj@gmail.com
Location: Mumbai / Pune, India (Available Worldwide)
Portfolio: ${window.location.origin}

SUMMARY:
${profile.bioText}

EXPERIENCE & BACKGROUND:
${profile.experienceStory}

KEY SOFTWARE SKILLS:
- Adobe Premiere Pro
- DaVinci Resolve Studio (Color Grading)
- Adobe After Effects (Motion Graphics & VFX)
- Adobe Photoshop (High-End Retouching & Compositing)
- Adobe Lightroom Classic
- Audio Sound Design & Mix

STATISTICS:
- ${profile.stats.projectsCompleted} Completed Projects
- ${profile.stats.yearsExperience} Industry Experience
- ${profile.stats.happyClients} Satisfied Clients
- ${profile.stats.viewsGenerated} Total Views Generated
`;
      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Shivaraj_Jadhav_CV_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section id="about" className="py-24 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-stone-50 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
            About The Artist
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-zinc-900 font-heading">
            Behind Every Frame is a Story
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-base leading-relaxed">
            Discover the creative vision, technical mastery, and dedication behind high-end post-production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Visual Profile with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <TiltCard maxTilt={5} glare={true} className="w-full">
              <div className="relative rounded-2xl overflow-hidden bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-xl group">
                <img
                  src={profile.profilePhotoUrl}
                  alt={profile.name}
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs uppercase tracking-widest text-orange-400 font-bold block mb-1">
                    Creative Director &amp; Editor
                  </span>
                  <h3 className="text-2xl font-bold text-white font-heading">{profile.name}</h3>
                  <p className="text-xs text-zinc-300 mt-1">{profile.profession}</p>
                </div>
              </div>
            </TiltCard>

            {/* Quick credentials grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-sm flex items-start gap-3">
                <Award className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white dark:text-white light:text-zinc-900">5+ Years</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Post-Production Craft</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-sm flex items-start gap-3">
                <Film className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white dark:text-white light:text-zinc-900">4K Workflow</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-500">Cinema Color Science</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white dark:text-white light:text-zinc-900 font-heading">
                Transforming Raw Footage Into Cinematic Magic
              </h3>
              <p className="text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed text-base">
                {profile.bioText}
              </p>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed text-sm">
                {profile.experienceStory}
              </p>
            </div>

            {/* Software Skills Suite */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-lg font-bold text-white dark:text-white light:text-zinc-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-500" />
                  Software Mastery &amp; Expertise
                </h4>
                {/* Segmented control tabs */}
                <div className="flex items-center gap-1 bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200/80 p-1 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-zinc-300">
                  {(['All', 'Software', 'Specialty'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === tab
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-white dark:hover:text-white light:hover:text-black'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Progress Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-3.5 rounded-xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-zinc-300 shadow-sm transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSkillIcon(sk.name)}
                        <span className="text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800">
                          {sk.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-500">{sk.percentage}%</span>
                    </div>
                    {/* Meter bar */}
                    <div className="w-full h-1.5 bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sk.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download CV Action with Magnetic Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <MagneticButton strength={0.2}>
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-900 hover:bg-orange-600 text-white border border-zinc-700 hover:border-orange-500 transition-all shadow-lg active:scale-95"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>Download CV / Rate Card</span>
                </button>
              </MagneticButton>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-orange-500 dark:hover:text-white transition-colors"
              >
                <span>Let&apos;s Discuss A Project &rarr;</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
