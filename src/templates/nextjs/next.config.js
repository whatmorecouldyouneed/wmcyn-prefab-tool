const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  basePath: isProd ? '/{{projectName}}' : '',
  assetPrefix: isProd ? '/{{projectName}}/' : '',
  output: 'export',
  images: { unoptimized: true }
}; 