"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/providers/AuthProvider";
import { OnboardingProvider } from "@/providers/OnboardingProvider";
import { SupportModalProvider } from "@/components/feedback/FeedBackProvider";
import { OnboardingModal } from "@/components/onboarding";

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
      <AuthProvider>
        <OnboardingProvider>
          <HeroUIProvider navigate={router.push}>
            <ToastProvider />
            <NextThemesProvider {...themeProps}>
              <SupportModalProvider>
                {children}
                <OnboardingModal />
              </SupportModalProvider>
            </NextThemesProvider>
          </HeroUIProvider>
        </OnboardingProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
