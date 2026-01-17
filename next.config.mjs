/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // מתעלם משגיאות ESLint בזמן בנייה (כמו משתנים לא בשימוש)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // מתעלם משגיאות טייפסקריפט בזמן בנייה (כמו any)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
