/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  // Phones testing via the Mac’s LAN IP (change if your IP differs).
  allowedDevOrigins: ["192.168.1.184"],

  compress: true,

  async headers() {
    const longCache = "public, max-age=31536000, immutable";
    const revalidate = "public, max-age=0, must-revalidate";
    // .unityweb = gzip bytes that Unity unpacks itself — do NOT set Content-Encoding.
    const unityBin = [
      { key: "Content-Type", value: "application/octet-stream" },
      { key: "Cache-Control", value: longCache },
    ];

    return [
      {
        source: "/unity/build.json",
        headers: [{ key: "Cache-Control", value: revalidate }],
      },
      {
        source: "/unity/Build/:file.wasm.unityweb",
        headers: unityBin,
      },
      {
        source: "/unity/Build/:file.framework.js.unityweb",
        headers: [
          { key: "Content-Type", value: "application/javascript" },
          { key: "Cache-Control", value: longCache },
        ],
      },
      {
        source: "/unity/Build/:file.data.unityweb",
        headers: unityBin,
      },
      {
        source: "/unity/Build/:file.unityweb",
        headers: unityBin,
      },
      // Legacy .gz builds (Content-Encoding required)
      {
        source: "/unity/Build/:path*.wasm.gz",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
          { key: "Content-Encoding", value: "gzip" },
          { key: "Cache-Control", value: longCache },
        ],
      },
      {
        source: "/unity/Build/:path*.framework.js.gz",
        headers: [
          { key: "Content-Type", value: "application/javascript" },
          { key: "Content-Encoding", value: "gzip" },
          { key: "Cache-Control", value: longCache },
        ],
      },
      {
        source: "/unity/Build/:path*.data.gz",
        headers: [
          { key: "Content-Type", value: "application/gzip" },
          { key: "Content-Encoding", value: "gzip" },
          { key: "Cache-Control", value: longCache },
        ],
      },
      {
        source: "/unity/Build/:path*.loader.js",
        headers: [
          { key: "Content-Type", value: "application/javascript" },
          { key: "Cache-Control", value: longCache },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
