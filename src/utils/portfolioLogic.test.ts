import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterMediaItems,
  reorderItems,
  parseVideoUrl,
  validateContactForm,
  validatePasswordUpdate,
} from './portfolioLogic.js';

test('filterMediaItems filters by category and published status correctly', () => {
  const sampleItems = [
    { id: '1', title: 'Urban Portrait', description: 'Street shot', category: 'Portrait Editing', published: true, order: 1 },
    { id: '2', title: 'Draft Wedding', description: 'Raw draft', category: 'Wedding Editing', published: false, order: 2 },
    { id: '3', title: 'Editorial Glow', description: 'Studio portrait', category: 'Portrait Editing', published: true, order: 3 },
  ];

  // Public visitor view: only published items
  const publicAll = filterMediaItems(sampleItems, { category: 'All', publishedOnly: true });
  assert.equal(publicAll.length, 2);
  assert.equal(publicAll[0].id, '1');
  assert.equal(publicAll[1].id, '3');

  // Filter by category
  const portraitItems = filterMediaItems(sampleItems, { category: 'Portrait Editing', publishedOnly: false });
  assert.equal(portraitItems.length, 2);

  // Search query
  const searchResults = filterMediaItems(sampleItems, { searchQuery: 'glow', publishedOnly: false });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].title, 'Editorial Glow');
});

test('reorderItems moves item and updates order numbers sequentially', () => {
  const items = [
    { id: 'a', order: 1 },
    { id: 'b', order: 2 },
    { id: 'c', order: 3 },
  ];

  // Move item 'c' (index 2) to top (index 0)
  const reordered = reorderItems(items, 2, 0);
  assert.equal(reordered[0].id, 'c');
  assert.equal(reordered[0].order, 1);
  assert.equal(reordered[1].id, 'a');
  assert.equal(reordered[1].order, 2);
  assert.equal(reordered[2].id, 'b');
  assert.equal(reordered[2].order, 3);
});

test('parseVideoUrl parses YouTube, Vimeo, and direct file URLs', () => {
  // YouTube standard watch URL
  const ytWatch = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(ytWatch.type, 'youtube');
  assert.equal(ytWatch.videoId, 'dQw4w9WgXcQ');
  assert.ok(ytWatch.embedUrl.includes('embed/dQw4w9WgXcQ'));

  // YouTube short link
  const ytShort = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
  assert.equal(ytShort.type, 'youtube');
  assert.equal(ytShort.videoId, 'dQw4w9WgXcQ');

  // Vimeo standard link
  const vimeo = parseVideoUrl('https://vimeo.com/76979871');
  assert.equal(vimeo.type, 'vimeo');
  assert.equal(vimeo.videoId, '76979871');
  assert.ok(vimeo.embedUrl.includes('player.vimeo.com/video/76979871'));

  // Direct MP4 file
  const directMp4 = parseVideoUrl('/uploads/showreel.mp4');
  assert.equal(directMp4.type, 'file');
  assert.equal(directMp4.embedUrl, '/uploads/showreel.mp4');
});

test('validateContactForm checks required fields and formats', () => {
  const invalid = validateContactForm({ name: '', email: 'notanemail', message: 'hi' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Rajesh Sharma',
    email: 'client@example.com',
    message: 'We loved your showreel and want to hire you for a commercial project.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validatePasswordUpdate checks minimum security length', () => {
  assert.equal(validatePasswordUpdate('123').valid, false);
  assert.equal(validatePasswordUpdate('StrongPassword123!').valid, true);
});
