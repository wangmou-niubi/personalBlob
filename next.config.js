/** @type {import('next').NextConfig} */
const repo = "personalBlob";
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

const nextConfig = {
  basePath,
  assetPrefix,
  output: "export",
};

module.exports = nextConfig;