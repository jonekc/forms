module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.SUPABASE_PROJECT_URL.replace('https://', ''),
        port: '',
        pathname: `/storage/v1/object/sign/${process.env.SUPABASE_BUCKET}/**`,
      },
    ],
  },
  experimental: {
    serverMinification: false,
  },
  output: "standalone",
  redirects: async () => [
    {
      source: '/posts',
      destination: '/',
      permanent: true,
    }]
};
