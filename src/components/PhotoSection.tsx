import React, { useState, useMemo } from 'react';
import {
  Camera,
  Maximize2,
  Sliders,
  X,
  Search,
  Layers,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types/portfolio.js';
import { BeforeAfterSlider } from './BeforeAfterSlider.js';
import { filterMediaItems } from '../utils/portfolioLogic.js';
import { TiltCard } from './animations/TiltCard.js';

interface PhotoSectionProps {
  photos: PhotoItem[];
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sliderActiveInModal, setSliderActiveInModal] = useState<boolean>(true);

  const categories = [
    'All',
    'Portrait Editing',
    'Retouching',
    'Wedding Editing',
    'Manipulation',
    'Creative Designs',
    'Other',
  ];

  const filteredPhotos = useMemo(() => {
    return filterMediaItems(photos, {
      category: selectedCategory,
      searchQuery,
      publishedOnly: true,
    });
  }, [photos, selectedCategory, searchQuery]);

  const openLightbox = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx !== -1 ? idx : 0);
    setSliderActiveInModal(Boolean(photo.beforeImageUrl));
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    const nextIdx = (lightboxIndex + 1) % filteredPhotos.length;
    setLightboxIndex(nextIdx);
    const item = filteredPhotos[nextIdx];
    setSelectedPhoto(item);
    setSliderActiveInModal(Boolean(item.beforeImageUrl));
  };

  const prevPhoto = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    const prevIdx = (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setLightboxIndex(prevIdx);
    const item = filteredPhotos[prevIdx];
    setSelectedPhoto(item);
    setSliderActiveInModal(Boolean(item.beforeImageUrl));
  };

  return (
    <section id="photo-portfolio" className="py-24 bg-zinc-950 dark:bg-zinc-950 light:bg-stone-50 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 relative transition-colors">
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
              <Camera className="w-4 h-4" />
              <span>Section A · High-End Retouching</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-zinc-900 font-heading">
              My Photo Editing
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-sm max-w-xl">
              Precision skin retouching, color grading, background manipulation, and fine-art portraiture. Hover or click any photo to inspect high-resolution details or drag the live before/after slider.
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photo edits..."
              className="w-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors shadow-sm"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
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

        {/* Photo Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-dashed border-zinc-800 dark:border-zinc-800 light:border-zinc-200 p-8">
            <Camera className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-zinc-300 dark:text-zinc-300 light:text-zinc-700">No photos found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (index % 6) * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <TiltCard maxTilt={5} glare={true} className="h-full">
                  <div className="h-full group relative rounded-2xl overflow-hidden bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 hover:border-orange-500/50 transition-all duration-300 flex flex-col shadow-lg">
                    {/* Media Container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Before/After Tag indicator if before image exists */}
                      {photo.beforeImageUrl && (
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold tracking-wider text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-md z-10">
                          <Sliders className="w-3 h-3" />
                          Before / After Available
                        </div>
                      )}

                      {/* Dark hover overlay with quick action */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-20">
                        <button
                          type="button"
                          onClick={() => openLightbox(photo)}
                          className="px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-orange-500"
                        >
                          <Maximize2 className="w-4 h-4" />
                          View Details &amp; Comparison
                        </button>
                      </div>
                    </div>

                    {/* Content details at bottom */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white">
                      <div>
                        {/* Metadata as clean text without pill capsules */}
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500 mb-1.5">
                          <span className="text-orange-500 font-semibold">{photo.category}</span>
                          {photo.date && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{photo.date}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white dark:text-white light:text-zinc-900 group-hover:text-orange-500 transition-colors font-heading">
                          {photo.title}
                        </h3>
                        <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                          {photo.description}
                        </p>
                      </div>

                      {photo.tools && photo.tools.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 flex items-center gap-1.5 flex-wrap text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500">
                          <Layers className="w-3 h-3 text-zinc-400" />
                          <span>{photo.tools.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full-Screen Lightbox & Before-After Comparison Modal */}
        <AnimatePresence>
          {selectedPhoto && lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Previous Photo navigation */}
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-zinc-900/80 border border-zinc-700 text-white hover:bg-orange-600 transition-colors hidden sm:flex items-center justify-center"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Photo navigation */}
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-zinc-900/80 border border-zinc-700 text-white hover:bg-orange-600 transition-colors hidden sm:flex items-center justify-center"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Modal Body Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-5xl bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-2xl overflow-hidden shadow-2xl my-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh]">
                  {/* Media view area (8 cols) */}
                  <div className="lg:col-span-8 bg-black flex items-center justify-center p-3 sm:p-6 relative min-h-[380px] lg:min-h-[550px]">
                    {selectedPhoto.beforeImageUrl && sliderActiveInModal ? (
                      <div className="w-full h-full flex flex-col justify-center">
                        <BeforeAfterSlider
                          beforeImage={selectedPhoto.beforeImageUrl}
                          afterImage={selectedPhoto.imageUrl}
                          className="w-full max-h-[520px] aspect-[4/5] sm:aspect-auto"
                        />
                        <p className="text-[11px] text-center text-zinc-400 mt-2">
                          Drag the center orange handle left and right to inspect the retouching transition
                        </p>
                      </div>
                    ) : (
                      <img
                        src={selectedPhoto.imageUrl}
                        alt={selectedPhoto.title}
                        className="max-h-[520px] w-auto max-w-full object-contain rounded-lg"
                      />
                    )}
                  </div>

                  {/* Details Sidebar (4 cols) */}
                  <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-zinc-900/95 dark:bg-zinc-900/95 light:bg-stone-50 border-t lg:border-t-0 lg:border-l border-zinc-800 dark:border-zinc-800 light:border-zinc-200 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Toggle Slider Mode if before image is available */}
                      {selectedPhoto.beforeImageUrl && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
                          <span className="text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-zinc-700 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-orange-500" />
                            Split Slider View
                          </span>
                          <button
                            type="button"
                            onClick={() => setSliderActiveInModal(!sliderActiveInModal)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                              sliderActiveInModal
                                ? 'bg-orange-600 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {sliderActiveInModal ? 'Active' : 'Off'}
                          </button>
                        </div>
                      )}

                      <div>
                        <span className="text-xs font-semibold text-orange-500 tracking-wider uppercase block mb-1">
                          {selectedPhoto.category}
                        </span>
                        <h3 className="text-2xl font-bold text-white dark:text-white light:text-zinc-900 font-heading">
                          {selectedPhoto.title}
                        </h3>
                      </div>

                      <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed">
                        {selectedPhoto.description}
                      </p>

                      {/* Metadata fields */}
                      <div className="space-y-2.5 pt-3 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs">
                        {selectedPhoto.client && (
                          <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
                            <User className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-zinc-500">Client:</span>
                            <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{selectedPhoto.client}</span>
                          </div>
                        )}
                        {selectedPhoto.date && (
                          <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-zinc-500">Completed:</span>
                            <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{selectedPhoto.date}</span>
                          </div>
                        )}
                        {selectedPhoto.tools && selectedPhoto.tools.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-zinc-500 block">Post-Production Tools:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedPhoto.tools.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-[11px] bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 dark:text-zinc-300 light:text-zinc-700"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 mt-6 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {lightboxIndex + 1} of {filteredPhotos.length}
                      </span>
                      <a
                        href="#contact"
                        onClick={closeLightbox}
                        className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase bg-orange-600 text-white hover:bg-orange-500 transition-colors"
                      >
                        Commission Similar Edit
                      </a>
                    </div>
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
