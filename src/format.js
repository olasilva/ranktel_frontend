export const naira = (n) => `₦${Number(n).toLocaleString('en-NG')}`;
export function timeAgo(ts) {
  const d = Math.max(0, Math.floor((Date.now() - new Date(ts)) / 864e5));
  if (d < 1) return 'Today';
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`;
  const w = Math.floor(d / 7);
  return w < 5 ? `${w} week${w > 1 ? 's' : ''} ago` : new Date(ts).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' });
}
