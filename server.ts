import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { initialPortfolioData } from './src/data/initialData.js';
import { PortfolioDatabase, PhotoItem, VideoItem } from './src/types/portfolio.js';
import { validateContactForm, parseVideoUrl } from './src/utils/portfolioLogic.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const AUTH_SECRET = process.env.AUTH_SECRET || 'shivaraj_jadhav_portfolio_secret_key_2026';

// Storage paths
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio-db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Generate simple secure session token
function createToken(payload: { email: string; timestamp: number }): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(b64).digest('base64url');
  return `${b64}.${signature}`;
}

function verifyToken(token: string): { email: string; timestamp: number } | null {
  try {
    const [b64, signature] = token.split('.');
    if (!b64 || !signature) return null;
    const expected = crypto.createHmac('sha256', AUTH_SECRET).update(b64).digest('base64url');
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      const decoded = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
      // Valid for 30 days
      if (Date.now() - decoded.timestamp < 30 * 24 * 60 * 60 * 1000) {
        return decoded;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Database helper functions
function readDb(): PortfolioDatabase {
  if (!fs.existsSync(DB_FILE)) {
    const salt = crypto.randomBytes(16).toString('hex');
    const initialDb: PortfolioDatabase = {
      ...initialPortfolioData,
      adminAuth: {
        email: 'jadhavbhaiyyaraj@gmail.com',
        // Default password: Shivaraj@2026!
        salt,
        passwordHash: hashPassword('Shivaraj@2026!', salt),
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as PortfolioDatabase;
  } catch (err) {
    console.error('Error reading database file, using initial data:', err);
    return initialPortfolioData;
  }
}

function writeDb(data: PortfolioDatabase): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Express middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded media & public static assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for local media storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max per upload
  fileFilter: (_req, file, cb) => {
    // Allow images, videos, audio, pdf
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// Admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session. Please login again.' });
  }

  const db = readDb();
  if (payload.email.toLowerCase() !== db.adminAuth.email.toLowerCase()) {
    return res.status(403).json({ error: 'Forbidden. Access restricted to authorized administrator.' });
  }

  next();
}

/* ==========================================================================
   PUBLIC APIS
   ========================================================================== */

// 1. Get Public Portfolio Data (only published items)
app.get('/api/portfolio', (_req: Request, res: Response) => {
  const db = readDb();
  const publishedPhotos = (db.photos || [])
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  const publishedVideos = (db.videos || [])
    .filter((v) => v.published)
    .sort((a, b) => a.order - b.order);

  res.json({
    profile: db.profile,
    photos: publishedPhotos,
    videos: publishedVideos,
    services: db.services || [],
    skills: db.skills || [],
    socials: db.socials || [],
    contactInfo: db.contactInfo,
    settings: {
      siteTitle: db.settings?.siteTitle || 'Shivaraj Jadhav — Portfolio',
      metaDescription: db.settings?.metaDescription || '',
      accentColor: db.settings?.accentColor || '#ff5722',
      logoUrl: db.settings?.logoUrl || '',
      logoText: db.settings?.logoText || 'SHIVRAJ JADHAV',
    },
  });
});

// 2. Public Contact Form Submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, serviceRequested, budget, message } = req.body;
  const validation = validateContactForm({ name, email, message });
  if (!validation.valid) {
    return res.status(400).json({ error: 'Validation failed', details: validation.errors });
  }

  const db = readDb();
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : undefined,
    serviceRequested: serviceRequested || 'General Inquiry',
    budget: budget || 'Flexible',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    isRead: false,
    isStarred: false,
  };

  db.messages = [newMessage, ...(db.messages || [])];
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Shivaraj has received your message and will respond shortly.',
  });
});

/* ==========================================================================
   AUTH APIS
   ========================================================================== */

// Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== db.adminAuth.email.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const computedHash = hashPassword(password, db.adminAuth.salt);
  if (computedHash !== db.adminAuth.passwordHash) {
    return res.status(401).json({ error: 'Invalid password. Please try again.' });
  }

  const token = createToken({ email: db.adminAuth.email, timestamp: Date.now() });

  res.json({
    token,
    user: {
      name: db.profile.name,
      email: db.adminAuth.email,
    },
  });
});

// Verify Current Token
app.get('/api/auth/me', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  res.json({
    user: {
      name: db.profile.name,
      email: db.adminAuth.email,
    },
  });
});

// Change Admin Password
app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const db = readDb();
  const currentHash = hashPassword(currentPassword, db.adminAuth.salt);
  if (currentHash !== db.adminAuth.passwordHash) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  db.adminAuth.salt = newSalt;
  db.adminAuth.passwordHash = hashPassword(newPassword, newSalt);
  writeDb(db);

  res.json({ success: true, message: 'Password updated successfully.' });
});

/* ==========================================================================
   ADMIN DATA APIS
   ========================================================================== */

// Get complete database for admin (including drafts, full messages, stats)
app.get('/api/admin/all', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  res.json({
    profile: db.profile,
    photos: db.photos || [],
    videos: db.videos || [],
    services: db.services || [],
    skills: db.skills || [],
    socials: db.socials || [],
    contactInfo: db.contactInfo,
    messages: db.messages || [],
    settings: db.settings,
    adminEmail: db.adminAuth.email,
  });
});

// Upload file endpoint
app.post('/api/upload', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Update Profile & Homepage
app.put('/api/admin/profile', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.profile = {
    ...db.profile,
    ...req.body,
    stats: {
      ...db.profile.stats,
      ...(req.body.stats || {}),
    },
    buttons: {
      ...db.profile.buttons,
      ...(req.body.buttons || {}),
    },
  };
  writeDb(db);
  res.json({ success: true, profile: db.profile });
});

// Photos CRUD
app.post('/api/admin/photos', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const photos = db.photos || [];
  const maxOrder = photos.reduce((max, p) => Math.max(max, p.order || 0), 0);

  const newPhoto: PhotoItem = {
    id: `photo-${Date.now()}`,
    title: req.body.title || 'Untitled Photo',
    description: req.body.description || '',
    category: req.body.category || 'Portrait Editing',
    imageUrl: req.body.imageUrl,
    beforeImageUrl: req.body.beforeImageUrl || undefined,
    client: req.body.client || undefined,
    tools: Array.isArray(req.body.tools) ? req.body.tools : req.body.tools ? [req.body.tools] : ['Photoshop'],
    date: req.body.date || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    published: req.body.published !== false,
    order: maxOrder + 1,
  };

  db.photos = [newPhoto, ...photos];
  writeDb(db);
  res.status(201).json(newPhoto);
});

app.put('/api/admin/photos/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = (db.photos || []).findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Photo not found.' });
  }

  db.photos[index] = {
    ...db.photos[index],
    ...req.body,
    id: req.params.id, // prevent overwriting id
  };
  writeDb(db);
  res.json(db.photos[index]);
});

app.delete('/api/admin/photos/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.photos = (db.photos || []).filter((p) => p.id !== req.params.id);
  // Re-normalize order
  db.photos.forEach((p, idx) => {
    p.order = idx + 1;
  });
  writeDb(db);
  res.json({ success: true });
});

app.put('/api/admin/photos/reorder', requireAdmin, (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Expected an array of photo IDs.' });
  }
  const db = readDb();
  const photoMap = new Map((db.photos || []).map((p) => [p.id, p]));
  const reordered: PhotoItem[] = [];

  ids.forEach((id, index) => {
    const item = photoMap.get(id);
    if (item) {
      item.order = index + 1;
      reordered.push(item);
      photoMap.delete(id);
    }
  });

  // Append any unreferenced items
  photoMap.forEach((item) => {
    item.order = reordered.length + 1;
    reordered.push(item);
  });

  db.photos = reordered;
  writeDb(db);
  res.json({ success: true, photos: db.photos });
});

// Videos CRUD
app.post('/api/admin/videos', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const videos = db.videos || [];
  const maxOrder = videos.reduce((max, v) => Math.max(max, v.order || 0), 0);

  const videoUrl = req.body.videoUrl || '';
  const parsed = parseVideoUrl(videoUrl);

  const newVideo: VideoItem = {
    id: `vid-${Date.now()}`,
    title: req.body.title || 'Untitled Video',
    description: req.body.description || '',
    category: req.body.category || 'Cinematic Edits',
    videoUrl: videoUrl,
    thumbnailUrl: req.body.thumbnailUrl || (parsed.videoId ? `https://img.youtube.com/vi/${parsed.videoId}/maxresdefault.jpg` : ''),
    duration: req.body.duration || '01:00',
    client: req.body.client || undefined,
    software: Array.isArray(req.body.software) ? req.body.software : req.body.software ? [req.body.software] : ['Premiere Pro'],
    aspectRatio: req.body.aspectRatio || '16:9',
    embedType: parsed.type,
    published: req.body.published !== false,
    order: maxOrder + 1,
  };

  db.videos = [newVideo, ...videos];
  writeDb(db);
  res.status(201).json(newVideo);
});

app.put('/api/admin/videos/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = (db.videos || []).findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found.' });
  }

  const updatedUrl = req.body.videoUrl || db.videos[index].videoUrl;
  const parsed = parseVideoUrl(updatedUrl);

  db.videos[index] = {
    ...db.videos[index],
    ...req.body,
    embedType: parsed.type,
    id: req.params.id,
  };
  writeDb(db);
  res.json(db.videos[index]);
});

app.delete('/api/admin/videos/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.videos = (db.videos || []).filter((v) => v.id !== req.params.id);
  db.videos.forEach((v, idx) => {
    v.order = idx + 1;
  });
  writeDb(db);
  res.json({ success: true });
});

app.put('/api/admin/videos/reorder', requireAdmin, (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Expected an array of video IDs.' });
  }
  const db = readDb();
  const videoMap = new Map((db.videos || []).map((v) => [v.id, v]));
  const reordered: VideoItem[] = [];

  ids.forEach((id, index) => {
    const item = videoMap.get(id);
    if (item) {
      item.order = index + 1;
      reordered.push(item);
      videoMap.delete(id);
    }
  });

  videoMap.forEach((item) => {
    item.order = reordered.length + 1;
    reordered.push(item);
  });

  db.videos = reordered;
  writeDb(db);
  res.json({ success: true, videos: db.videos });
});

// Services CRUD
app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newService = {
    id: `srv-${Date.now()}`,
    title: req.body.title || 'New Service',
    description: req.body.description || '',
    iconName: req.body.iconName || 'Film',
    deliverables: Array.isArray(req.body.deliverables) ? req.body.deliverables : ['4K Delivery'],
    highlight: Boolean(req.body.highlight),
  };
  db.services = [...(db.services || []), newService];
  writeDb(db);
  res.status(201).json(newService);
});

app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = (db.services || []).findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found' });
  db.services[index] = { ...db.services[index], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.services[index]);
});

app.delete('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.services = (db.services || []).filter((s) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Skills CRUD
app.post('/api/admin/skills', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newSkill = {
    id: `sk-${Date.now()}`,
    name: req.body.name || 'New Skill',
    category: req.body.category || 'Software',
    percentage: Number(req.body.percentage) || 90,
    iconName: req.body.iconName || 'Sliders',
  };
  db.skills = [...(db.skills || []), newSkill];
  writeDb(db);
  res.status(201).json(newSkill);
});

app.put('/api/admin/skills/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = (db.skills || []).findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });
  db.skills[index] = { ...db.skills[index], ...req.body, id: req.params.id };
  writeDb(db);
  res.json(db.skills[index]);
});

app.delete('/api/admin/skills/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.skills = (db.skills || []).filter((s) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Socials & Contact Info
app.put('/api/admin/socials', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.socials = req.body;
  writeDb(db);
  res.json({ success: true, socials: db.socials });
});

app.put('/api/admin/contact-info', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.contactInfo = { ...db.contactInfo, ...req.body };
  writeDb(db);
  res.json({ success: true, contactInfo: db.contactInfo });
});

// Messages management
app.get('/api/admin/messages', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.messages || []);
});

app.patch('/api/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const msg = (db.messages || []).find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  if (typeof req.body.isRead === 'boolean') msg.isRead = req.body.isRead;
  if (typeof req.body.isStarred === 'boolean') msg.isStarred = req.body.isStarred;
  writeDb(db);
  res.json(msg);
});

app.delete('/api/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.messages = (db.messages || []).filter((m) => m.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Settings & Maintenance
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

app.post('/api/admin/reset-default-data', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  // Preserve current password and salt
  const currentAuth = db.adminAuth;
  const resetDb: PortfolioDatabase = {
    ...initialPortfolioData,
    adminAuth: currentAuth,
  };
  writeDb(resetDb);
  res.json({ success: true, message: 'Showcase data restored successfully.' });
});

/* ==========================================================================
   Vite Middleware / Production Static Serve
   ========================================================================== */

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
