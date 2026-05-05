/** Backend API base URL (no trailing slash). */
export const API_BASE_URL = (() => {
  const raw = import.meta.env.VITE_API_URL
  if (raw != null && String(raw).trim() !== '') {
    return String(raw).replace(/\/$/, '')
  }
  // Dev: Vite talks to local Flask. Production build without VITE_API_URL: same-origin (e.g. Docker).
  if (import.meta.env.DEV) {
    return 'http://localhost:5001'
  }
  return ''
})()
