// import withOffline from "next-offline";
import nextPWA from '@ducanh2912/next-pwa';
const withPWA = nextPWA({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Fix Error: Expected signal to be an instanceof AbortSignal
   * https://github.com/vercel/next.js/issues/55682
   */
  experimental: {
    serverMinification: false,
  },
  output: "standalone",
  /**
   * Next.js Offline
   * https://github.com/vercel/next.js/blob/canary/examples/next-offline/next.config.js
   */
  // workboxOpts: {
  //   swDest: process.env.NEXT_EXPORT
  //     ? "service-worker.js"
  //     : "static/service-worker.js",
  //   runtimeCaching: [
  //     {
  //       urlPattern: /^https?.*/,
  //       handler: "NetworkFirst",
  //       options: {
  //         cacheName: "offlineCache",
  //         expiration: {
  //           maxEntries: 200,
  //         },
  //       },
  //     },
  //   ],
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/service-worker.js",
  //       destination: "/_next/static/service-worker.js",
  //     },
  //   ];
  // },
};

// export default withOffline(nextConfig);
export default withPWA(nextConfig);
// export default nextConfig;
