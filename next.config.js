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
    // .unityweb files are gzip on disk. Tell the browser so it unzips with
    // built-in code (fast on phones) instead of Unity's JavaScript unzip.
    const gzipUnity = (type) => [
      { key: "Content-Type", value: type },
      { key: "Content-Encoding", value: "gzip" },
      { key: "Cache-Control", value: longCache },
    ];

    return [
      {
        source: "/unity/build.json",
        headers: [{ key: "Cache-Control", value: revalidate }],
      },
      {
        source: "/unity/Build/:file.wasm.unityweb",
        headers: gzipUnity("application/wasm"),
      },
      {
        source: "/unity/Build/:file.framework.js.unityweb",
        headers: gzipUnity("application/javascript"),
      },
      {
        source: "/unity/Build/:file.data.unityweb",
        headers: gzipUnity("application/octet-stream"),
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
