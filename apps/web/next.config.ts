import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com", protocol: "https" },
      { hostname: "localhost", port: "4000", protocol: "http" },
      { hostname: "127.0.0.1", port: "4000", protocol: "http" },
    ],
  },
  reactCompiler: true,
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
