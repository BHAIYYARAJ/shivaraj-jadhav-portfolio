export interface BaseMediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  published: boolean;
  order: number;
}

export interface PhotoItem extends BaseMediaItem {
  imageUrl: string;
  beforeImageUrl?: string;
  client?: string;
  tools?: string[];
  date?: string;
}

export interface VideoItem extends BaseMediaItem {
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  client?: string;
  software?: string[];
  aspectRatio: '16:9' | '9:16' | '4:5' | '1:1';
  embedType?: 'file' | 'youtube' | 'vimeo';
}

/**
 * Filter items by category, publication status, and optional search term
 */
export function filterMediaItems<T extends BaseMediaItem>(
  items: T[],
  options: {
    category?: string;
    publishedOnly?: boolean;
    searchQuery?: string;
  }
): T[] {
  const { category = 'All', publishedOnly = true, searchQuery = '' } = options;
  const query = searchQuery.trim().toLowerCase();

  return items
    .filter((item) => {
      if (publishedOnly && !item.published) return false;
      if (category && category !== 'All' && item.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (query) {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        return titleMatch || descMatch || catMatch;
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Reorder items in an array cleanly
 */
export function reorderItems<T extends { order: number }>(
  items: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
    return items;
  }
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

/**
 * Parse YouTube or Vimeo URL into embeddable format
 */
export function parseVideoUrl(url: string): {
  type: 'youtube' | 'vimeo' | 'file';
  embedUrl: string;
  videoId?: string;
} {
  const trimmed = url.trim();
  if (!trimmed) {
    return { type: 'file', embedUrl: '' };
  }

  // YouTube matchers: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
    };
  }

  // Vimeo matcher: vimeo.com/123456789
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const videoId = vimeoMatch[3] || vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
    };
  }

  // Direct video file
  return {
    type: 'file',
    embedUrl: trimmed,
  };
}

/**
 * Validate contact inquiry form fields
 */
export function validateContactForm(data: {
  name?: string;
  email?: string;
  message?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters)';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide a message with at least 10 characters';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate password change
 */
export function validatePasswordUpdate(newPassword: string): { valid: boolean; error?: string } {
  if (!newPassword || newPassword.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
}
