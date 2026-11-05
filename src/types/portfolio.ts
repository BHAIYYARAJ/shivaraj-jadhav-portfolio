export interface PhotoItem {
  id: string;
  title: string;
  description: string;
  category: 'Portrait Editing' | 'Retouching' | 'Wedding Editing' | 'Manipulation' | 'Creative Designs' | 'Other';
  imageUrl: string;
  beforeImageUrl?: string; // For before-and-after slider comparison
  client?: string;
  tools?: string[];
  date?: string;
  published: boolean;
  order: number;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: 'Reels' | 'YouTube Videos' | 'Cinematic Edits' | 'Wedding Films' | 'Promotional Videos' | 'Motion Graphics' | 'Other';
  videoUrl: string; // File URL or YouTube/Vimeo link
  thumbnailUrl: string;
  duration?: string;
  client?: string;
  software?: string[];
  aspectRatio: '16:9' | '9:16' | '4:5' | '1:1';
  embedType?: 'file' | 'youtube' | 'vimeo';
  published: boolean;
  order: number;
}

export interface ProfileData {
  name: string;
  profession: string;
  heroHeading: string;
  heroSubheading: string;
  introText: string;
  bioText: string;
  experienceStory: string;
  profilePhotoUrl: string;
  heroBackgroundUrl: string;
  cvUrl?: string;
  stats: {
    projectsCompleted: string;
    yearsExperience: string;
    happyClients: string;
    viewsGenerated: string;
  };
  buttons: {
    hireMeText: string;
    hireMeLink: string;
    viewWorkText: string;
    viewWorkLink: string;
  };
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Software' | 'Specialty' | 'Motion' | 'Audio';
  percentage: number;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  deliverables: string[];
  highlight?: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  availability: string;
  responseTime: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceRequested?: string;
  budget?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isStarred?: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  accentColor: string;
  adminEmail: string;
  logoUrl?: string;
  logoText?: string;
}

export interface PortfolioDatabase {
  profile: ProfileData;
  photos: PhotoItem[];
  videos: VideoItem[];
  services: ServiceItem[];
  skills: SkillItem[];
  socials: SocialLink[];
  contactInfo: ContactInfo;
  messages: ContactMessage[];
  settings: SiteSettings;
  adminAuth: {
    email: string;
    passwordHash: string;
    salt: string;
  };
}
