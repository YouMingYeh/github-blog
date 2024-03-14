import { type MetadataRoute } from "next";

// This is the robots.txt file for the site. It is used to control the web crawlers and the sitemap for the site.
export default function robots(): MetadataRoute.Robots {
  const robots = {
    rules: [
      {
        userAgent: "*",
        disallow: ["/private", "/tmp"],
        allow: ["/"]
      },
      {
        userAgent: ["Googlebot", "Bingbot"],
        disallow: ["/edit"],
        allow: ["/"], 
      },
    ],
    sitemap: ["https://github-blog-blue.vercel.app"],
    host: "github-blog-blue.vercel.app",
  };
  return robots;
}
