declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    reloadOnOnline?: boolean;
    swcMinify?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    workboxOptions?: {
      disableDevLogs?: boolean;
      runtimeCaching?: Array<{
        urlPattern: RegExp | string;
        handler: string;
        method?: string;
        options?: {
          cacheName?: string;
          expiration?: {
            maxEntries?: number;
            maxAgeSeconds?: number;
          };
          cacheableResponse?: {
            statuses?: number[];
          };
          rangeRequests?: boolean;
          networkTimeoutSeconds?: number;
        };
      }>;
    };
  }

  export default function withPWA(
    config: PWAConfig,
  ): (nextConfig: NextConfig) => NextConfig;
}
