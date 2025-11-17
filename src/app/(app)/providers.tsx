"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";

import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { SupportModalProvider } from "@/components/feedback/FeedBackProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <React.StrictMode>
      <UserProvider>
        <HeroUIProvider navigate={router.push}>
          <ToastProvider />
          <NextThemesProvider {...themeProps}>
            <SupportModalProvider>
              {children}
            </SupportModalProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </UserProvider>
    </React.StrictMode>
  );
}
