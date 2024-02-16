import React, { type ReactNode } from "react";

interface LayoutProps {
  readonly children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <div className="relative h-full w-full">{children}</div>;
}
