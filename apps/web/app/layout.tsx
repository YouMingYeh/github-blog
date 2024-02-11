import "@/styles/globals.css";
import "@/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";

import AuthButton from "@/components/auth-button";
import Menu from "@/components/ui/menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";

const title =
  "Novel - Notion-style WYSIWYG editor with AI-powered autocompletions";
const description =
  "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@steventey",
  },
  metadataBase: new URL("https://novel.sh"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="fixed right-1 top-1 z-20">
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
