/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // تجاهل أخطاء ESLint أثناء البناء
    ignoreDuringBuilds: true,
  },
  typescript: {
    // تجاهل أخطاء TypeScript أثناء البناء
    ignoreBuildErrors: true,
  },
  output: 'standalone',
}

module.exports = nextConfig