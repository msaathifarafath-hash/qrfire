/**
 * QuickQR Utility Helpers
 * Input detection, validation, and storage management
 */

// Input type detection with icons
export function detectInputType(text) {
  if (!text || !text.trim()) return { type: 'empty', label: 'Empty', icon: '💭' };

  const trimmed = text.trim();

  // URL detection
  if (/^https?:\/\/.+/i.test(trimmed) || /^www\..+/i.test(trimmed)) {
    return { type: 'url', label: 'URL', icon: '🔗' };
  }

  // Email detection
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { type: 'email', label: 'Email', icon: '✉️' };
  }

  // Phone number detection
  if (/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,}$/.test(trimmed)) {
    return { type: 'phone', label: 'Phone', icon: '📱' };
  }

  // Wi-Fi detection
  if (/^WIFI:/i.test(trimmed)) {
    return { type: 'wifi', label: 'Wi-Fi', icon: '📶' };
  }

  return { type: 'text', label: 'Text', icon: '📝' };
}

// Validate URL
export function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Sanitize input to prevent XSS
export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// History management using localStorage
const HISTORY_KEY = 'quickqr_history';
const MAX_HISTORY = 10;

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry) {
  const history = getHistory();
  // Avoid duplicates (same text)
  const filtered = history.filter((h) => h.text !== entry.text);
  const newHistory = [
    {
      ...entry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    },
    ...filtered,
  ].slice(0, MAX_HISTORY);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  return [];
}

// Format relative time
export function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Convert QR canvas to blob for download/share
export async function qrToBlob(svgElement) {
  return new Promise((resolve) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 3; // 3x for high-res
      canvas.height = img.height * 3;
      ctx.scale(3, 3);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  });
}

// Download helper
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download SVG
export function downloadSvg(svgElement, filename) {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  downloadBlob(blob, filename);
}
