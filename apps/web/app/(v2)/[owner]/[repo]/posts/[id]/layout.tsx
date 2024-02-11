import React, { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="relative h-full w-full">{children}</div>;
}
