import "@/styles/globals.css";
import "@/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import AuthButton from "@/components/AuthButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Github } from "@/components/ui/icons";
import { SpeedInsights } from "@vercel/speed-insights/next";

const title = "GitHub Blog";
const description =
  "GitHub Blog - Notion-style WYSIWYG editor with GitHub Issues as a CMS.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  metadataBase: new URL("https://github-blog-blue.vercel.app/"),
  applicationName: title,
  authors: [{ name: "YouMingYeh" }],
  keywords: ["GitHub", "Blog", "CMS", "WYSIWYG", "Notion"],
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.github.com" />

        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />

        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body>
        <SpeedInsights />
        <Providers>
          <div className="fixed right-1 top-1 z-20 flex gap-1">
            {/* @ts-expect-error Server Component */}
            <AuthButton />
          </div>
          <div className="fixed left-1 top-1 z-20 flex gap-1">
            <ModeToggle />
            <Link href="https://github.com/YouMingYeh/github-blog.git">
              <Button aria-label="github" size="icon" variant="outline">
                <Github />
              </Button>
            </Link>
            <Link href="/">
              <Button
                aria-label="home"
                size="icon"
                variant="outline"
                className=""
              >
                <HomeIcon />
              </Button>
            </Link>
          </div>
          <div className="flex h-screen w-screen items-center justify-center align-middle">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
