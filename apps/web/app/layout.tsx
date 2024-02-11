import "@/styles/globals.css";
import "@/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";

import AuthButton from "@/components/auth-button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

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
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="fixed right-1 top-1 z-20 flex gap-1">
            <Button size="icon" variant="outline" className="">
              <Link href="/">
                <HomeIcon />
              </Link>
            </Button>
            {/* @ts-expect-error Server Component */}
            <AuthButton />
          </div>
          <div className="fixed left-1 top-1 z-20">
            <ModeToggle />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
