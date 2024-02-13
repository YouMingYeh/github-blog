import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const robots = {
    rules: [
      {
        userAgent: "*", // Applies to all web crawlers
        disallow: ["/private", "/tmp"], // Directories you don't want to be crawled
        allow: ["/"], // Optionally, directories you explicitly want to be crawled
      },
      {
        userAgent: ["Googlebot", "Bingbot"], // Applies specifically to Google's and Bing's crawlers
        disallow: ["/edit"], // Directories these crawlers can't access
        allow: ["/"], // Directories specifically allowed for these crawlers
      },
    ],
    sitemap: ["https://github-blog-blue.vercel.app"], // Location of your sitemap(s)
    host: "github-blog-blue.vercel.app", // The preferred domain for accessing your site
  };
  return robots;
}
