import React, { useState, useMemo } from 'react';
import {
  Film,
  Play,
  X,
  Search,
  Clock,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoItem } from '../types/portfolio.js';
import { filterMediaItems, parseVideoUrl } from '../utils/portfolioLogic.js';
import { TiltCard } from './animations/TiltCard.js';

interface VideoSectionProps {
  videos: VideoItem[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const categories = [
    'All',
    'Reels',
    'YouTube Videos',
    'Cinematic Edits',
    'Wedding Films',
    'Promotional Videos',
    'Motion Graphics',
    'Other',
  ];

  const filteredVideos = useMemo(() => {
    return filterMediaItems(videos, {
      category: selectedCategory,
      searchQuery,
      publishedOnly: true,
    });
  }, [videos, selectedCategory, searchQuery]);

  const openPlayer = (video: VideoItem) => {
    setActiveVideo(video);
  };

  const closePlayer = () => {
    setActiveVideo(null);
  };

  return (
    <section id="video-portfolio" className="py-24 bg-[#09090b] dark:bg-[#09090b] light:bg-white border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-orange-500 uppercase">
              <Film className="w-4 h-4" />
              <span>Section B · Motion &amp; Cinema</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-zinc-900 font-heading">
              My Video Editing
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-sm max-w-xl">
              High-octane commercials, emotion-filled wedding films, viral vertical reels, and YouTube creator edits. Click any thumbnail to stream in full cinematic high-definition player.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search video projects..."
              className="w-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors shadow-sm"
            />
          </div>
        </motion.div>

        {/* Category Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]'
                  : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white text-zinc-400 dark:text-zinc-400 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-dashed border-zinc-800 dark:border-zinc-800 light:border-zinc-200 p-8">
            <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-zinc-300 dark:text-zinc-300 light:text-zinc-700">No video projects found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try switching categories or clearing search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => {
              const isVertical = video.aspectRatio === '9:16';
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: (index % 6) * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <TiltCard maxTilt={5} glare={true} className="h-full">
                    <div className="h-full group relative rounded-2xl overflow-hidden bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 hover:border-orange-500/50 transition-all duration-300 flex flex-col shadow-xl">
                      {/* Thumbnail & Hover Play Trigger */}
                      <div
                        onClick={() => openPlayer(video)}
                        className="relative aspect-video overflow-hidden bg-zinc-950 cursor-pointer"
                      >
                        <img
                          src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Gradient shade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-60 transition-opacity" />

                        {/* Format / Aspect Ratio Badge */}
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold tracking-wider text-zinc-300 border border-zinc-700">
                          {isVertical ? '9:16 REEL' : '16:9 4K'}
                        </div>

                        {/* Duration badge */}
                        {video.duration && (
                          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-semibold text-zinc-300 flex items-center gap-1 border border-zinc-800">
                            <Clock className="w-3 h-3 text-orange-400" />
                            <span>{video.duration}</span>
                          </div>
                        )}

                        {/* Center Animated Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.6)] group-hover:scale-110 group-hover:bg-orange-500 transition-all">
                            <Play className="w-6 h-6 fill-white ml-1" />
                          </div>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white">
                        <div>
                          {/* Quiet unboxed text metadata */}
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500 mb-1.5">
                            <span className="text-orange-500 font-semibold">{video.category}</span>
                            {video.client && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{video.client}</span>
                              </>
                            )}
                          </div>

                          <h3
                            onClick={() => openPlayer(video)}
                            className="text-base font-bold text-white dark:text-white light:text-zinc-900 group-hover:text-orange-500 transition-colors font-heading cursor-pointer"
                          >
                            {video.title}
                          </h3>
                          <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        </div>

                        {/* Software tags */}
                        {video.software && video.software.length > 0 && (
                          <div className="pt-3 mt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 flex items-center gap-1.5 flex-wrap text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500">
                            <Layers className="w-3 h-3 text-zinc-400" />
                            <span>{video.software.join(' · ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Cinematic Popup Video Player Modal */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={closePlayer}
                className="absolute top-4 right-4 z-50 p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors shadow-2xl"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-4xl bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-2xl overflow-hidden shadow-2xl my-auto"
              >
                {/* Video Player Display Area */}
                <div
                  className={`relative w-full bg-black flex items-center justify-center ${
                    activeVideo.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'
                  }`}
                >
                  {(() => {
                    const parsed = parseVideoUrl(activeVideo.videoUrl);
                    if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
                      return (
                        <iframe
                          src={parsed.embedUrl}
                          title={activeVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      );
                    }
                    return (
                      <video
                        src={activeVideo.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        poster={activeVideo.thumbnailUrl}
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  })()}
                </div>

                {/* Video Info Details below player */}
                <div className="p-6 bg-zinc-900 dark:bg-zinc-900 light:bg-stone-50 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-orange-500 font-bold uppercase">{activeVideo.category}</span>
                      {activeVideo.duration && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-400 dark:text-zinc-400 light:text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            {activeVideo.duration}
                          </span>
                        </>
                      )}
                      {activeVideo.client && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-300 dark:text-zinc-300 light:text-zinc-700 font-medium">Client: {activeVideo.client}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-zinc-900 font-heading">{activeVideo.title}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-2xl">{activeVideo.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href="#contact"
                      onClick={closePlayer}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-lg"
                    >
                      Hire For Video Edit
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
