const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://ranktel-backend.onrender.com');
const TOKEN_KEY = 'ranktel-auth-token';

async function req(path, opts) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    ...(opts?.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts?.headers,
  };
  const res = await fetch(`${BASE}/api${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

const post = (path, body) => req(path, { method: 'POST', body: JSON.stringify(body) });
const adminReq = (path, opts = {}) => req(path, { ...opts, headers: { 'x-admin-key': sessionStorage.getItem('ranktel-admin-key') || '', ...opts.headers } });
const adminPost = (path, body) => adminReq(path, { method: 'POST', body: JSON.stringify(body) });
export const getConfig = () => req('/config');
export const getHome = () => req('/home');
export const getCatalog = (params) => req(`/catalog?${new URLSearchParams(params)}`);
export const getProduct = (slug) => req(`/products/${encodeURIComponent(slug)}`);
export const createOrder = (body) => post('/orders', body);
export const verifyPayment = (ref) => req(`/orders/verify/${encodeURIComponent(ref)}`);
export const getMyOrders = () => req('/orders/mine');
export const getReferral = () => req('/referrals');
export const sendReview = (body) => post('/reviews', body);
export const subscribe = (email) => post('/newsletter', { email });
export const register = (body) => post('/auth/register', body);
export const login = (body) => post('/auth/login', body);
export const getMe = () => req('/auth/me');
export const authTokenKey = TOKEN_KEY;
export const getAdminProducts = () => adminReq('/admin/products');
export const getAdminOrders = () => adminReq('/admin/orders');
export const updateAdminProduct = (slug, body) => adminReq(`/admin/products/${encodeURIComponent(slug)}`, { method: 'PATCH', body: JSON.stringify(body) });
export const updateAdminOrderStatus = (orderNo, status) => adminPost(`/admin/orders/${encodeURIComponent(orderNo)}/status`, { status });
export const sendAdminMessage = (body) => adminPost('/admin/outreach', body);
