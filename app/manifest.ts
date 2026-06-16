import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KaamSetu",
    short_name: "KaamSetu",
    description: "Local Work. Trusted People.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#0f766e",
    lang: "en",
    orientation: "portrait",
  };
}
