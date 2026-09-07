// Demo mode runs the whole app on in-browser mock data with no real backend,
// Firebase project, or database. It turns on automatically whenever no real
// backend URL is configured, so a fresh clone with no .env file works out of
// the box. Set NEXT_PUBLIC_API_URL (and the Firebase env vars) to point at a
// real backend to leave demo mode and use the real API/auth again.
export const isDemoMode = !process.env.NEXT_PUBLIC_API_URL
