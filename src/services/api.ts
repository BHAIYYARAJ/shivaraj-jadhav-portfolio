import {
  PortfolioDatabase,
  ProfileData,
  PhotoItem,
  VideoItem,
  ServiceItem,
  SkillItem,
  SocialLink,
  ContactInfo,
  ContactMessage,
  SiteSettings,
} from '../types/portfolio.js';

export interface PublicPortfolioResponse {
  profile: ProfileData;
  photos: PhotoItem[];
  videos: VideoItem[];
  services: ServiceItem[];
  skills: SkillItem[];
  socials: SocialLink[];
  contactInfo: ContactInfo;
  settings: SiteSettings;
}

const TOKEN_KEY = 'shivaraj_admin_token';

export const api = {
  // Token management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  // Helper for authenticated requests
  async authFetch(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      this.clearToken();
      window.dispatchEvent(new Event('admin-logged-out'));
    }
    return response;
  },

  // Public APIs
  async getPublicPortfolio(): Promise<PublicPortfolioResponse> {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('Failed to load portfolio data');
    return res.json();
  },

  async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    serviceRequested?: string;
    budget?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to send message');
    }
    return result;
  },

  // Admin Auth APIs
  async login(email: string, password: string): Promise<{ token: string; user: { name: string; email: string } }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    this.setToken(data.token);
    return data;
  },

  async verifyAuth(): Promise<{ user: { name: string; email: string } }> {
    const res = await this.authFetch('/api/auth/me');
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    const res = await this.authFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update password');
    return data;
  },

  // Admin Data APIs
  async getAdminAll(): Promise<PortfolioDatabase & { adminEmail: string }> {
    const res = await this.authFetch('/api/admin/all');
    if (!res.ok) throw new Error('Failed to load admin data');
    return res.json();
  },

  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await this.authFetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },

  async updateProfile(profile: Partial<ProfileData>): Promise<void> {
    const res = await this.authFetch('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
  },

  // Photos
  async createPhoto(photo: Partial<PhotoItem>): Promise<PhotoItem> {
    const res = await this.authFetch('/api/admin/photos', {
      method: 'POST',
      body: JSON.stringify(photo),
    });
    if (!res.ok) throw new Error('Failed to add photo');
    return res.json();
  },

  async updatePhoto(id: string, photo: Partial<PhotoItem>): Promise<PhotoItem> {
    const res = await this.authFetch(`/api/admin/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(photo),
    });
    if (!res.ok) throw new Error('Failed to update photo');
    return res.json();
  },

  async deletePhoto(id: string): Promise<void> {
    const res = await this.authFetch(`/api/admin/photos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete photo');
  },

  async reorderPhotos(ids: string[]): Promise<void> {
    const res = await this.authFetch('/api/admin/photos/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to reorder photos');
  },

  // Videos
  async createVideo(video: Partial<VideoItem>): Promise<VideoItem> {
    const res = await this.authFetch('/api/admin/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
    if (!res.ok) throw new Error('Failed to add video');
    return res.json();
  },

  async updateVideo(id: string, video: Partial<VideoItem>): Promise<VideoItem> {
    const res = await this.authFetch(`/api/admin/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(video),
    });
    if (!res.ok) throw new Error('Failed to update video');
    return res.json();
  },

  async deleteVideo(id: string): Promise<void> {
    const res = await this.authFetch(`/api/admin/videos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete video');
  },

  async reorderVideos(ids: string[]): Promise<void> {
    const res = await this.authFetch('/api/admin/videos/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to reorder videos');
  },

  // Services & Skills
  async createService(service: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await this.authFetch('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
    return res.json();
  },

  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await this.authFetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
    return res.json();
  },

  async deleteService(id: string): Promise<void> {
    await this.authFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
  },

  async createSkill(skill: Partial<SkillItem>): Promise<SkillItem> {
    const res = await this.authFetch('/api/admin/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
    return res.json();
  },

  async updateSkill(id: string, skill: Partial<SkillItem>): Promise<SkillItem> {
    const res = await this.authFetch(`/api/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skill),
    });
    return res.json();
  },

  async deleteSkill(id: string): Promise<void> {
    await this.authFetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
  },

  // Socials & Contact
  async updateSocials(socials: SocialLink[]): Promise<void> {
    await this.authFetch('/api/admin/socials', {
      method: 'PUT',
      body: JSON.stringify(socials),
    });
  },

  async updateContactInfo(info: ContactInfo): Promise<void> {
    await this.authFetch('/api/admin/contact-info', {
      method: 'PUT',
      body: JSON.stringify(info),
    });
  },

  // Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await this.authFetch('/api/admin/messages');
    return res.json();
  },

  async updateMessageStatus(id: string, updates: { isRead?: boolean; isStarred?: boolean }): Promise<void> {
    await this.authFetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteMessage(id: string): Promise<void> {
    await this.authFetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings & Reset
  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    await this.authFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async resetDefaultData(): Promise<void> {
    const res = await this.authFetch('/api/admin/reset-default-data', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Reset failed');
  },
};
