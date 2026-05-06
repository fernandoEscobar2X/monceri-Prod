import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
const allowLocalImageOptimization =
  process.env.NODE_ENV !== "production" &&
  (apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1"));

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: allowLocalImageOptimization,
    remotePatterns: [
      { hostname: "images.unsplash.com", pathname: "/**", protocol: "https" },
      { hostname: "localhost", pathname: "/uploads/**", port: "4000", protocol: "http" },
      { hostname: "127.0.0.1", pathname: "/uploads/**", port: "4000", protocol: "http" },
    ],
  },
  reactCompiler: true,
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
