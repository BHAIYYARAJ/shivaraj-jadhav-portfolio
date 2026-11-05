import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { api, PublicPortfolioResponse } from './services/api.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { AboutSection } from './components/AboutSection.js';
import { ServicesSection } from './components/ServicesSection.js';
import { PhotoSection } from './components/PhotoSection.js';
import { VideoSection } from './components/VideoSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { AdminLoginModal } from './components/admin/AdminLoginModal.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { CustomCursor } from './components/animations/CustomCursor.js';
import { Preloader } from './components/animations/Preloader.js';

export default function App() {
  const [data, setData] = useState<PublicPortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Quick hire service pre-fill
  const [prefilledService, setPrefilledService] = useState<string | undefined>();

  const loadPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPublicPortfolio();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to portfolio server.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth and URL hash on mount
  useEffect(() => {
    loadPortfolio();
    const token = api.getToken();
    if (token) {
      setIsAdminLoggedIn(true);
    }

    // Check if user navigated to #admin
    if (window.location.hash === '#admin') {
      if (token) {
        setAdminDashboardOpen(true);
      } else {
        setAdminLoginOpen(true);
      }
    }

    const handleLogoutEvent = () => {
      setIsAdminLoggedIn(false);
      setAdminDashboardOpen(false);
    };
    window.addEventListener('admin-logged-out', handleLogoutEvent);
    return () => window.removeEventListener('admin-logged-out', handleLogoutEvent);
  }, [loadPortfolio]);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setAdminDashboardOpen(true);
  };

  const handleSelectService = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreWork = () => {
    const videoElem = document.getElementById('video-portfolio');
    if (videoElem) {
      videoElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight font-heading">SHIVRAJ JADHAV</h2>
            <p className="text-xs text-zinc-400 mt-1">Loading creative portfolio &amp; media...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-red-500/30 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Failed to load portfolio</h2>
          <p className="text-xs text-zinc-400">{error}</p>
          <button
            type="button"
            onClick={loadPortfolio}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <ThemeProvider>
      {/* Award-winning Cinematic Preloader on Initial Entry */}
      <Preloader />

      {/* Luxury Trailing Custom Cursor on Desktop */}
      <CustomCursor />

      <div className="min-h-screen bg-[#09090b] dark:bg-[#09090b] light:bg-[#f8fafc] text-[#f4f4f5] dark:text-[#f4f4f5] light:text-[#09090b] selection:bg-orange-500 selection:text-white transition-colors duration-300">
        {/* Fixed Navbar with Configurable Logo & Theme Toggle */}
        <Navbar
          onOpenAdminLogin={() => setAdminLoginOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
          onGoToDashboard={() => setAdminDashboardOpen(true)}
          settings={data.settings}
        />

        {/* Main Public Page Content */}
        <main>
          {/* Hero Section */}
          <Hero
            profile={data.profile}
            socials={data.socials}
            onExploreWork={handleExploreWork}
          />

          {/* About Section */}
          <AboutSection
            profile={data.profile}
            skills={data.skills}
          />

          {/* Services Section */}
          <ServicesSection
            services={data.services}
            onSelectService={handleSelectService}
          />

          {/* SECTION A: Photo Editing Portfolio */}
          <PhotoSection
            photos={data.photos}
          />

          {/* SECTION B: Video Editing Portfolio */}
          <VideoSection
            videos={data.videos}
          />

          {/* Contact Section */}
          <ContactSection
            contactInfo={data.contactInfo}
            socials={data.socials}
            prefilledService={prefilledService}
          />
        </main>

        {/* Footer */}
        <Footer
          socials={data.socials}
          onOpenAdminLogin={() => setAdminLoginOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
          onGoToDashboard={() => setAdminDashboardOpen(true)}
          settings={data.settings}
        />

        {/* Admin Login Dialog */}
        <AdminLoginModal
          isOpen={adminLoginOpen}
          onClose={() => setAdminLoginOpen(false)}
          onSuccess={handleAdminLoginSuccess}
        />

        {/* Private Admin Dashboard */}
        {adminDashboardOpen && (
          <AdminDashboard
            onClose={() => setAdminDashboardOpen(false)}
            onRefreshPublicData={loadPortfolio}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
