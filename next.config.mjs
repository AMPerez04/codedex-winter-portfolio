/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old resume URL may still be linked from past applications.
      { source: '/resume-swe.pdf', destination: '/Austin-Perez-Resume.pdf', permanent: false },    ];
  },
};

export default nextConfig;
