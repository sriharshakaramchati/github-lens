/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL,
  }
}

module.exports = nextConfig
