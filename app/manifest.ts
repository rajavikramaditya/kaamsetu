import type { MetadataRoute } from "next";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: `${APP_TAGLINE}. ${APP_DESCRIPTION}`,
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#047857",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
