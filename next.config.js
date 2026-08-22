/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

// Makes Cloudflare bindings (D1, env vars/secrets) available to route
// handlers when running `next dev` locally, sourced from .dev.vars.
// This is a no-op in production (Workers provides bindings natively there).
//
// @opennextjs/cloudflare ships as an ES module, so a CommonJS file like
// this one can't `require()` it directly on older Node versions (Node 22.12+
// added transparent require(esm) support, but Node 20.x doesn't have it) —
// a dynamic import() works everywhere.
import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
  initOpenNextCloudflareForDev();
});
