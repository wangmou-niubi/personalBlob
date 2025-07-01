/** @type {import('next').NextConfig} */
const repo = "personalBlob";

const basePath = `/${repo}`;

const nextConfig = {
  basePath,
  assetPrefix: basePath,
  output: "export",
};

module.exports = nextConfig;