import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Home,
  User,
  Camera,
  Film,
  Briefcase,
  Sliders,
  Share2,
  Phone,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageSquare,
  Lock,
  RefreshCw,
  Download,
  Play,
  X,
  FileText,
  Mail,
  Star,
} from 'lucide-react';
import {
  PortfolioDatabase,
  PhotoItem,
  VideoItem,
  ServiceItem,
  SkillItem,
  SocialLink,
  ContactInfo,
  ContactMessage,
} from '../../types/portfolio.js';
import { api } from '../../services/api.js';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshPublicData: () => void;
}

type TabType =
  | 'overview'
  | 'homepage'
  | 'about'
  | 'photos'
  | 'videos'
  | 'services'
  | 'skills'
  | 'socials'
  | 'contact'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onRefreshPublicData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [db, setDb] = useState<PortfolioDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [photoForm, setPhotoForm] = useState<Partial<PhotoItem>>({
    title: '',
    description: '',
    category: 'Portrait Editing',
    imageUrl: '',
    beforeImageUrl: '',
    client: '',
    tools: ['Photoshop'],
    published: true,
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({
    title: '',
    description: '',
    category: 'Cinematic Edits',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '01:00',
    client: '',
    software: ['Premiere Pro'],
    aspectRatio: '16:9',
    published: true,
  });

  // Password change state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load database on mount
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminAll();
      setDb(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load database' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Helper for single file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading file...', 'success');
      const res = await api.uploadFile(file);
      targetField(res.url);
      showToast('File uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    }
  };

  /* --------------------------------------------------------------------------
     Profile & Homepage Handlers
     -------------------------------------------------------------------------- */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    try {
      setSaving(true);
      await api.updateProfile(db.profile);
      showToast('Homepage and profile updated successfully!');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------------------------------------------------
     Photo Portfolio Handlers
     -------------------------------------------------------------------------- */
  const openNewPhotoModal = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: '',
      description: '',
      category: 'Portrait Editing',
      imageUrl: '',
      beforeImageUrl: '',
      client: '',
      tools: ['Photoshop', 'Lightroom'],
      published: true,
    });
    setPhotoModalOpen(true);
  };

  const openEditPhotoModal = (photo: PhotoItem) => {
    setEditingPhoto(photo);
    setPhotoForm({ ...photo });
    setPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.imageUrl) {
      showToast('Please provide an image URL or upload an image', 'error');
      return;
    }
    try {
      setSaving(true);
      if (editingPhoto) {
        await api.updatePhoto(editingPhoto.id, photoForm);
        showToast('Photo updated successfully!');
      } else {
        await api.createPhoto(photoForm);
        showToast('New photo added to portfolio!');
      }
      setPhotoModalOpen(false);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from your portfolio?')) return;
    try {
      await api.deletePhoto(id);
      showToast('Photo deleted successfully');
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleTogglePhotoPublish = async (photo: PhotoItem) => {
    try {
      await api.updatePhoto(photo.id, { published: !photo.published });
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update publication status', 'error');
    }
  };

  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    if (!db || !db.photos) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= db.photos.length) return;

    const newPhotos = [...db.photos];
    const [moved] = newPhotos.splice(index, 1);
    newPhotos.splice(targetIndex, 0, moved);

    const ids = newPhotos.map((p) => p.id);
    try {
      await api.reorderPhotos(ids);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast('Failed to reorder photos', 'error');
    }
  };

  /* --------------------------------------------------------------------------
     Video Portfolio Handlers
     -------------------------------------------------------------------------- */
  const openNewVideoModal = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      description: '',
      category: 'Cinematic Edits',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '01:30',
      client: '',
      software: ['Premiere Pro', 'DaVinci Resolve'],
      aspectRatio: '16:9',
      published: true,
    });
    setVideoModalOpen(true);
  };

  const openEditVideoModal = (video: VideoItem) => {
    setEditingVideo(video);
    setVideoForm({ ...video });
    setVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.videoUrl) {
      showToast('Please provide a video URL or upload a video file', 'error');
      return;
    }
    try {
      setSaving(true);
      if (editingVideo) {
        await api.updateVideo(editingVideo.id, videoForm);
        showToast('Video updated successfully!');
      } else {
        await api.createVideo(videoForm);
        showToast('New video added to portfolio!');
      }
      setVideoModalOpen(false);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.deleteVideo(id);
      showToast('Video deleted');
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleToggleVideoPublish = async (video: VideoItem) => {
    try {
      await api.updateVideo(video.id, { published: !video.published });
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    if (!db || !db.videos) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= db.videos.length) return;

    const newVideos = [...db.videos];
    const [moved] = newVideos.splice(index, 1);
    newVideos.splice(targetIndex, 0, moved);

    const ids = newVideos.map((v) => v.id);
    try {
      await api.reorderVideos(ids);
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast('Failed to reorder videos', 'error');
    }
  };

  /* --------------------------------------------------------------------------
     Password & Maintenance Handlers
     -------------------------------------------------------------------------- */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      setSaving(true);
      await api.changePassword(passwordState.currentPassword, passwordState.newPassword);
      showToast('Password updated successfully!');
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Password change failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!confirm('Warning: This will restore the default showcase portfolio data. Your admin password will be kept. Proceed?')) return;
    try {
      await api.resetDefaultData();
      showToast('Default showcase data restored!');
      await loadData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Reset failed', 'error');
    }
  };

  const handleExportData = () => {
    if (!db) return;
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shivaraj_portfolio_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    api.clearToken();
    onClose();
    window.location.reload();
  };

  const navItems: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'homepage', label: 'Edit Homepage', icon: Home },
    { id: 'about', label: 'Manage About Me', icon: User },
    { id: 'photos', label: 'Manage Photo Portfolio', icon: Camera, count: db?.photos?.length },
    { id: 'videos', label: 'Manage Video Portfolio', icon: Film, count: db?.videos?.length },
    { id: 'services', label: 'Manage Services', icon: Briefcase, count: db?.services?.length },
    { id: 'skills', label: 'Manage Skills', icon: Sliders, count: db?.skills?.length },
    { id: 'socials', label: 'Social Media Links', icon: Share2 },
    {
      id: 'contact',
      label: 'Contact Info & Inbox',
      icon: Phone,
      count: db?.messages?.filter((m) => !m.isRead).length,
    },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  if (loading || !db) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wide">Loading Shivaraj Jadhav Admin Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0a0a0c] text-zinc-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-[70] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border ${
            feedback.type === 'success'
              ? 'bg-zinc-900 text-emerald-400 border-emerald-500/40'
              : 'bg-zinc-900 text-red-400 border-red-500/40'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                SJ
              </span>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide">ADMIN CONSOLE</h1>
                <p className="text-[10px] text-orange-400 font-semibold">{db.profile.name}</p>
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white font-semibold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-orange-600'
                          : item.id === 'contact'
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>View Public Website</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#09090b]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-zinc-400">
              Changes reflect immediately on your live website portfolio.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Database Synchronized
            </span>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {/* =========================================================================
              TAB 1: OVERVIEW
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Photo Portfolio
                    </span>
                    <Camera className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{db.photos?.length || 0}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {db.photos?.filter((p) => p.published).length} published ·{' '}
                    {db.photos?.filter((p) => !p.published).length} drafts
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Video Portfolio
                    </span>
                    <Film className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{db.videos?.length || 0}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {db.videos?.filter((v) => v.published).length} published ·{' '}
                    {db.videos?.filter((v) => !v.published).length} drafts
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Services &amp; Skills
                    </span>
                    <Briefcase className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">
                    {(db.services?.length || 0) + (db.skills?.length || 0)}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {db.services?.length} services · {db.skills?.length} software skills
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Client Inquiries
                    </span>
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{db.messages?.length || 0}</p>
                  <p className="text-xs text-orange-400 font-semibold mt-1">
                    {db.messages?.filter((m) => !m.isRead).length} unread inquiries
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/30 via-zinc-900 to-zinc-900 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Welcome back, Shivaraj!
                  </h3>
                  <p className="text-xs text-zinc-300">
                    Your portfolio is currently live and receiving inquiries at{' '}
                    <span className="text-orange-400 font-medium">
                      {(db as any).adminEmail || db.adminAuth?.email || 'jadhavbhaiyyaraj@gmail.com'}
                    </span>.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={openNewPhotoModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-orange-400" />
                    <span>Add Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={openNewVideoModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Video</span>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white font-heading">
                    Recent Contact Inquiries
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="text-xs text-orange-400 hover:underline"
                  >
                    View All Inquiries &rarr;
                  </button>
                </div>

                {(!db.messages || db.messages.length === 0) ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">No inquiries received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {db.messages.slice(0, 3).map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{msg.name}</span>
                            <span className="text-xs text-zinc-400">({msg.email})</span>
                            {!msg.isRead && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-orange-400 font-semibold mt-0.5">
                            {msg.serviceRequested} · Budget: {msg.budget || 'Flexible'}
                          </p>
                          <p className="text-xs text-zinc-300 mt-2 line-clamp-2">{msg.message}</p>
                        </div>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: EDIT HOMEPAGE
             ========================================================================= */}
          {activeTab === 'homepage' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
                <h3 className="text-lg font-bold text-white font-heading">
                  Hero Section &amp; Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={db.profile.name}
                      onChange={(e) =>
                        setDb({ ...db, profile: { ...db.profile, name: e.target.value } })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Profession / Title
                    </label>
                    <input
                      type="text"
                      value={db.profile.profession}
                      onChange={(e) =>
                        setDb({ ...db, profile: { ...db.profile, profession: e.target.value } })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Hero Small Heading
                    </label>
                    <input
                      type="text"
                      value={db.profile.heroHeading}
                      onChange={(e) =>
                        setDb({ ...db, profile: { ...db.profile, heroHeading: e.target.value } })
                      }
                      placeholder="Hi, I'm Shivaraj Jadhav"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Hero Big Headline
                    </label>
                    <input
                      type="text"
                      value={db.profile.heroSubheading}
                      onChange={(e) =>
                        setDb({ ...db, profile: { ...db.profile, heroSubheading: e.target.value } })
                      }
                      placeholder="Creative Video & Photo Editor"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Introduction Text
                  </label>
                  <textarea
                    rows={3}
                    value={db.profile.introText}
                    onChange={(e) =>
                      setDb({ ...db, profile: { ...db.profile, introText: e.target.value } })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Profile Photo */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={db.profile.profilePhotoUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={db.profile.profilePhotoUrl}
                        onChange={(e) =>
                          setDb({
                            ...db,
                            profile: { ...db.profile, profilePhotoUrl: e.target.value },
                          })
                        }
                        placeholder="Image URL"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span>Upload New Profile Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) =>
                              setDb({
                                ...db,
                                profile: { ...db.profile, profilePhotoUrl: url },
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Counters */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  Statistics Counters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Completed Projects</label>
                    <input
                      type="text"
                      value={db.profile.stats.projectsCompleted}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            stats: { ...db.profile.stats, projectsCompleted: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Years Experience</label>
                    <input
                      type="text"
                      value={db.profile.stats.yearsExperience}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            stats: { ...db.profile.stats, yearsExperience: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Happy Clients</label>
                    <input
                      type="text"
                      value={db.profile.stats.happyClients}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            stats: { ...db.profile.stats, happyClients: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Views Generated</label>
                    <input
                      type="text"
                      value={db.profile.stats.viewsGenerated}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            stats: { ...db.profile.stats, viewsGenerated: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Call to action buttons settings */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  Homepage Action Buttons
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Hire Me Button Label</label>
                    <input
                      type="text"
                      value={db.profile.buttons.hireMeText}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            buttons: { ...db.profile.buttons, hireMeText: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Hire Me Link Target</label>
                    <input
                      type="text"
                      value={db.profile.buttons.hireMeLink}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            buttons: { ...db.profile.buttons, hireMeLink: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">View Work Button Label</label>
                    <input
                      type="text"
                      value={db.profile.buttons.viewWorkText}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            buttons: { ...db.profile.buttons, viewWorkText: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">View Work Link Target</label>
                    <input
                      type="text"
                      value={db.profile.buttons.viewWorkLink}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          profile: {
                            ...db.profile,
                            buttons: { ...db.profile.buttons, viewWorkLink: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Homepage Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 3: MANAGE ABOUT ME
             ========================================================================= */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
                <h3 className="text-lg font-bold text-white font-heading">
                  About Me Narrative
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Main Biography &amp; Creative Philosophy
                  </label>
                  <textarea
                    rows={4}
                    value={db.profile.bioText}
                    onChange={(e) =>
                      setDb({ ...db, profile: { ...db.profile, bioText: e.target.value } })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Editing Background &amp; Journey Story
                  </label>
                  <textarea
                    rows={4}
                    value={db.profile.experienceStory}
                    onChange={(e) =>
                      setDb({ ...db, profile: { ...db.profile, experienceStory: e.target.value } })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* CV Upload */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Curriculum Vitae / Rate Card (PDF or Document)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={db.profile.cvUrl || ''}
                        onChange={(e) =>
                          setDb({ ...db, profile: { ...db.profile, cvUrl: e.target.value } })
                        }
                        placeholder="File URL or upload below (leave empty for auto-generated printable card)"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span>Upload CV Document</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) =>
                              setDb({ ...db, profile: { ...db.profile, cvUrl: url } })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save About Me'}</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 4: MANAGE PHOTO PORTFOLIO
             ========================================================================= */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Photo Portfolio Manager
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Add, edit, reorder, or toggle publication of photo retouching works.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewPhotoModal}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload &amp; Add Photo</span>
                </button>
              </div>

              {/* Photos Table / List */}
              <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
                <div className="divide-y divide-zinc-800/80">
                  {db.photos?.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Order controls */}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMovePhoto(index, 'up')}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === (db.photos?.length || 0) - 1}
                            onClick={() => handleMovePhoto(index, 'down')}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Image preview thumbnail */}
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-700 bg-zinc-950 shrink-0"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{photo.title}</h4>
                            {photo.beforeImageUrl && (
                              <span className="text-[10px] font-semibold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded">
                                Before/After
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-orange-400 mt-0.5">{photo.category}</p>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                            {photo.description}
                          </p>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePhotoPublish(photo)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                            photo.published
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {photo.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{photo.published ? 'Published' : 'Draft'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditPhotoModal(photo)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          title="Edit Photo Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: MANAGE VIDEO PORTFOLIO
             ========================================================================= */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Video Portfolio Manager
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Add, edit, reorder, embed YouTube/Vimeo, or upload MP4 video files.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewVideoModal}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Video</span>
                </button>
              </div>

              {/* Videos List */}
              <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
                <div className="divide-y divide-zinc-800/80">
                  {db.videos?.map((video, index) => (
                    <div
                      key={video.id}
                      className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Order controls */}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveVideo(index, 'up')}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === (db.videos?.length || 0) - 1}
                            onClick={() => handleMoveVideo(index, 'down')}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail */}
                        <img
                          src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80'}
                          alt={video.title}
                          className="w-20 h-14 rounded-xl object-cover border border-zinc-700 bg-zinc-950 shrink-0"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{video.title}</h4>
                            <span className="text-[10px] font-semibold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                              {video.aspectRatio}
                            </span>
                          </div>
                          <p className="text-xs text-orange-400 mt-0.5">
                            {video.category} · {video.duration || '01:00'}
                          </p>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{video.videoUrl}</p>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleToggleVideoPublish(video)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                            video.published
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {video.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{video.published ? 'Published' : 'Draft'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditVideoModal(video)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          title="Edit Video"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30"
                          title="Delete Video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: MANAGE SERVICES
             ========================================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Services &amp; Specializations
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Add or edit service cards and their deliverable checklists.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await api.createService({
                      title: 'New Creative Service',
                      description: 'Comprehensive post-production service description.',
                      iconName: 'Film',
                      deliverables: ['High-res deliverable', '2 revision rounds'],
                      highlight: false,
                    });
                    await loadData();
                    onRefreshPublicData();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {db.services?.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const updated = db.services.map((s) =>
                            s.id === srv.id ? { ...s, title: e.target.value } : s
                          );
                          setDb({ ...db, services: updated });
                        }}
                        className="text-base font-bold text-white bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await api.deleteService(srv.id);
                          await loadData();
                          onRefreshPublicData();
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => {
                        const updated = db.services.map((s) =>
                          s.id === srv.id ? { ...s, description: e.target.value } : s
                        );
                        setDb({ ...db, services: updated });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 resize-none"
                    />

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Deliverables (comma separated)
                      </label>
                      <input
                        type="text"
                        value={srv.deliverables?.join(', ') || ''}
                        onChange={(e) => {
                          const deliverables = e.target.value.split(',').map((d) => d.trim());
                          const updated = db.services.map((s) =>
                            s.id === srv.id ? { ...s, deliverables } : s
                          );
                          setDb({ ...db, services: updated });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={srv.highlight || false}
                          onChange={(e) => {
                            const updated = db.services.map((s) =>
                              s.id === srv.id ? { ...s, highlight: e.target.checked } : s
                            );
                            setDb({ ...db, services: updated });
                          }}
                          className="rounded text-orange-600 focus:ring-0"
                        />
                        <span>Highlight as Signature Craft</span>
                      </label>

                      <button
                        type="button"
                        onClick={async () => {
                          await api.updateService(srv.id, srv);
                          showToast('Service saved');
                          onRefreshPublicData();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold"
                      >
                        Save Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 7: MANAGE SKILLS
             ========================================================================= */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Software Skills &amp; Proficiencies
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Manage software toolbars and proficiency meters displayed in the About section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await api.createSkill({
                      name: 'New Tool / Skill',
                      category: 'Software',
                      percentage: 90,
                      iconName: 'Sliders',
                    });
                    await loadData();
                    onRefreshPublicData();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {db.skills?.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={sk.name}
                        onChange={(e) => {
                          const updated = db.skills.map((s) =>
                            s.id === sk.id ? { ...s, name: e.target.value } : s
                          );
                          setDb({ ...db, skills: updated });
                        }}
                        className="text-sm font-bold text-white bg-transparent border-b border-zinc-700 pb-0.5 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await api.deleteSkill(sk.id);
                          await loadData();
                          onRefreshPublicData();
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                          <span>Proficiency</span>
                          <span className="text-orange-400 font-bold">{sk.percentage}%</span>
                        </label>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={sk.percentage}
                          onChange={(e) => {
                            const updated = db.skills.map((s) =>
                              s.id === sk.id ? { ...s, percentage: Number(e.target.value) } : s
                            );
                            setDb({ ...db, skills: updated });
                          }}
                          className="w-full accent-orange-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          await api.updateSkill(sk.id, sk);
                          showToast('Skill updated');
                          onRefreshPublicData();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-orange-600 text-white text-xs font-semibold shrink-0"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 8: SOCIAL MEDIA LINKS
             ========================================================================= */}
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Social Media Links
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage Instagram, YouTube, WhatsApp, and LinkedIn connection links.
                </p>
              </div>

              <div className="space-y-4">
                {db.socials?.map((soc, idx) => (
                  <div
                    key={soc.id}
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                  >
                    <div>
                      <span className="block text-xs font-semibold text-white">{soc.platform}</span>
                      <span className="text-[10px] text-zinc-500">Platform</span>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">Handle / Label</label>
                      <input
                        type="text"
                        value={soc.label}
                        onChange={(e) => {
                          const updated = [...db.socials];
                          updated[idx].label = e.target.value;
                          setDb({ ...db, socials: updated });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">Profile URL</label>
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const updated = [...db.socials];
                          updated[idx].url = e.target.value;
                          setDb({ ...db, socials: updated });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await api.updateSocials(db.socials);
                    showToast('Social links saved successfully');
                    onRefreshPublicData();
                  }}
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Social Links</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 9: CONTACT INFORMATION & INQUIRY INBOX
             ========================================================================= */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              {/* Contact Info Details Form */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
                <h3 className="text-lg font-bold text-white font-heading">
                  Contact Information &amp; Availability
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Inquiry Email Address
                    </label>
                    <input
                      type="email"
                      value={db.contactInfo.email}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          contactInfo: { ...db.contactInfo, email: e.target.value },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Direct Phone
                    </label>
                    <input
                      type="text"
                      value={db.contactInfo.phone}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          contactInfo: { ...db.contactInfo, phone: e.target.value },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={db.contactInfo.whatsapp}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          contactInfo: { ...db.contactInfo, whatsapp: e.target.value },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={db.contactInfo.address}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          contactInfo: { ...db.contactInfo, address: e.target.value },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await api.updateContactInfo(db.contactInfo);
                      showToast('Contact information saved');
                      onRefreshPublicData();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Save Contact Info
                  </button>
                </div>
              </div>

              {/* Inquiry Inbox */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">
                      Client Inquiries Inbox
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Messages received directly through the website contact form.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-3 py-1 rounded-full">
                    {db.messages?.length || 0} Messages
                  </span>
                </div>

                {(!db.messages || db.messages.length === 0) ? (
                  <p className="text-xs text-zinc-500 py-8 text-center">Inbox is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {db.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          msg.isRead
                            ? 'bg-zinc-950/70 border-zinc-800/80'
                            : 'bg-zinc-900 border-orange-500/40 shadow-lg'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-white">{msg.name}</h4>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>{msg.email}</span>
                              </a>
                              {msg.phone && (
                                <span className="text-xs text-zinc-400">· {msg.phone}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                              <span className="text-orange-400 font-semibold">{msg.serviceRequested}</span>
                              <span>·</span>
                              <span>Budget: {msg.budget || 'Flexible'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={async () => {
                                await api.updateMessageStatus(msg.id, { isRead: !msg.isRead });
                                await loadData();
                              }}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                                msg.isRead
                                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                  : 'bg-orange-600 text-white border-orange-500'
                              }`}
                            >
                              {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm('Delete this message?')) {
                                  await api.deleteMessage(msg.id);
                                  await loadData();
                                }
                              }}
                              className="p-1.5 text-zinc-500 hover:text-red-400"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-2">
                          Received: {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 10: WEBSITE SETTINGS
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Password Change Box */}
              <form onSubmit={handlePasswordChange} className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  Change Administrator Password
                </h3>
                <p className="text-xs text-zinc-400">
                  Only Shivaraj Jadhav can change the admin login credential.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordState.currentPassword}
                      onChange={(e) =>
                        setPasswordState({ ...passwordState, currentPassword: e.target.value })
                      }
                      placeholder="••••••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordState.newPassword}
                      onChange={(e) =>
                        setPasswordState({ ...passwordState, newPassword: e.target.value })
                      }
                      placeholder="Min 6 characters"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordState.confirmPassword}
                      onChange={(e) =>
                        setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                      }
                      placeholder="Repeat new password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Update Password
                  </button>
                </div>
              </form>

              {/* Logo & Branding Management */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">
                      Website Logo &amp; Brand Identity
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Easily replace your website logo by uploading an image (PNG, SVG, WEBP) or configure a crisp text fallback.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Upload / URL Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Logo Image URL / Upload
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={db.settings?.logoUrl || ''}
                          onChange={(e) =>
                            setDb({
                              ...db,
                              settings: { ...db.settings, logoUrl: e.target.value },
                            })
                          }
                          placeholder="Paste logo image URL or click Upload"
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                        />
                        <label className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer flex items-center gap-1.5 shrink-0 border border-zinc-700">
                          <Upload className="w-3.5 h-3.5 text-orange-400" />
                          <span>Upload Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (url) =>
                                setDb({ ...db, settings: { ...db.settings, logoUrl: url } })
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Logo Text Fallback
                      </label>
                      <input
                        type="text"
                        value={db.settings?.logoText || 'SHIVRAJ JADHAV'}
                        onChange={(e) =>
                          setDb({
                            ...db,
                            settings: { ...db.settings, logoText: e.target.value },
                          })
                        }
                        placeholder="e.g. SHIVRAJ JADHAV"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Displayed when no image is uploaded or if image loading fails.
                      </p>
                    </div>

                    {db.settings?.logoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setDb({
                            ...db,
                            settings: { ...db.settings, logoUrl: '' },
                          })
                        }
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Image Logo (Revert to Text Logo)</span>
                      </button>
                    )}
                  </div>

                  {/* Live Logo Preview Box */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Live Navbar Preview
                    </span>
                    <div className="p-4 rounded-lg bg-black/80 border border-zinc-800 flex items-center gap-3">
                      {db.settings?.logoUrl ? (
                        <img
                          src={db.settings.logoUrl}
                          alt={db.settings.logoText || 'Logo Preview'}
                          className="h-9 w-auto max-w-[160px] object-contain"
                        />
                      ) : (
                        <>
                          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
                            {(db.settings?.logoText || 'SJ').slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white font-heading">
                              {db.settings?.logoText || 'SHIVRAJ JADHAV'}
                            </p>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                              Video &amp; Photo Editor
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await api.updateSettings(db.settings);
                      onRefreshPublicData();
                      showToast('Logo & branding settings saved successfully');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Save Logo Settings
                  </button>
                </div>
              </div>

              {/* SEO & Meta Settings */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  SEO &amp; Branding Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Browser Title
                    </label>
                    <input
                      type="text"
                      value={db.settings?.siteTitle || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          settings: { ...db.settings, siteTitle: e.target.value },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={db.settings?.metaDescription || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          settings: { ...db.settings, metaDescription: e.target.value },
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await api.updateSettings(db.settings);
                      showToast('SEO settings saved');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Save SEO Settings
                  </button>
                </div>
              </div>

              {/* Backup & System Maintenance */}
              <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  Data Backup &amp; Showcase Reset
                </h3>
                <p className="text-xs text-zinc-400">
                  Export an offline JSON backup of your database, or reset back to default showcase data.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700"
                  >
                    <Download className="w-4 h-4 text-orange-400" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 text-xs font-semibold flex items-center gap-2 border border-red-500/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restore Showcase Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          PHOTO MODAL (ADD / EDIT)
         ========================================================================= */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
            <button
              type="button"
              onClick={() => setPhotoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 font-heading">
              {editingPhoto ? 'Edit Photo Details' : 'Add New Photo to Portfolio'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Configure image URL, optional before/after comparison pair, category, and metadata.
            </p>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoForm.title || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    placeholder="e.g. Editorial Glow Portrait"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={photoForm.category || 'Portrait Editing'}
                    onChange={(e) =>
                      setPhotoForm({ ...photoForm, category: e.target.value as any })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Portrait Editing">Portrait Editing</option>
                    <option value="Retouching">Retouching</option>
                    <option value="Wedding Editing">Wedding Editing</option>
                    <option value="Manipulation">Manipulation</option>
                    <option value="Creative Designs">Creative Designs</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={photoForm.description || ''}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                  placeholder="Techniques applied, color grading notes..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white resize-none"
                />
              </div>

              {/* Main Image Upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Main Edited Image * (JPG, PNG, WEBP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={photoForm.imageUrl || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                    placeholder="Paste image URL or upload"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setPhotoForm({ ...photoForm, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              {/* Before Image for Slider */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Optional RAW / Before Image (enables Before/After Split Slider!)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={photoForm.beforeImageUrl || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, beforeImageUrl: e.target.value })}
                    placeholder="Before image URL or upload"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setPhotoForm({ ...photoForm, beforeImageUrl: url }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={photoForm.client || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, client: e.target.value })}
                    placeholder="e.g. Studio Vogue"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tools Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(photoForm.tools) ? photoForm.tools.join(', ') : ''}
                    onChange={(e) =>
                      setPhotoForm({
                        ...photoForm,
                        tools: e.target.value.split(',').map((t) => t.trim()),
                      })
                    }
                    placeholder="Photoshop, Lightroom"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={photoForm.published !== false}
                    onChange={(e) => setPhotoForm({ ...photoForm, published: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-0"
                  />
                  <span>Publish immediately to public website</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : editingPhoto ? 'Update Photo' : 'Save Photo'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIDEO MODAL (ADD / EDIT)
         ========================================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
            <button
              type="button"
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1 font-heading">
              {editingVideo ? 'Edit Video Details' : 'Add New Video Project'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Add MP4 file upload, or embed YouTube / Vimeo links.
            </p>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.title || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    placeholder="e.g. Neon Drift Automotive Film"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={videoForm.category || 'Cinematic Edits'}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, category: e.target.value as any })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Reels">Reels</option>
                    <option value="YouTube Videos">YouTube Videos</option>
                    <option value="Cinematic Edits">Cinematic Edits</option>
                    <option value="Wedding Films">Wedding Films</option>
                    <option value="Promotional Videos">Promotional Videos</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Video URL * (YouTube link, Vimeo link, or MP4 file)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={videoForm.videoUrl || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or /uploads/video.mp4"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Upload MP4</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setVideoForm({ ...videoForm, videoUrl: url }))
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Custom Thumbnail */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Custom Thumbnail Image (JPG, PNG, WEBP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoForm.thumbnailUrl || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                    placeholder="Thumbnail image URL"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) =>
                          setVideoForm({ ...videoForm, thumbnailUrl: url })
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={videoForm.aspectRatio || '16:9'}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, aspectRatio: e.target.value as any })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="16:9">16:9 (Standard Widescreen / YouTube)</option>
                    <option value="9:16">9:16 (Vertical Reel / TikTok / Short)</option>
                    <option value="4:5">4:5 (Instagram Portrait)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Duration (e.g. 02:15)
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="01:30"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={videoForm.client || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, client: e.target.value })}
                    placeholder="Apex Motors"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={videoForm.description || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Editing techniques, pace, sound design details..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoForm.published !== false}
                    onChange={(e) => setVideoForm({ ...videoForm, published: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-0"
                  />
                  <span>Publish immediately to public website</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : editingVideo ? 'Update Video' : 'Save Video'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
