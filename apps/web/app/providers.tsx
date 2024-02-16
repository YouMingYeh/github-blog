"use client";

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
} from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  readonly children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

  return (
    <ThemeProvider
      attribute="class"
      enableSystem
      disableTransitionOnChange
      defaultTheme="system"
    >
      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        <ToasterProvider />
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
        <Analytics />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
