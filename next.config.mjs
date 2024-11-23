/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/recipes',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
};

export default nextConfig;
