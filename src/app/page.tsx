"use client";

import { useTranslations } from "next-intl";
import Loading from "./loading";

import { redirect } from "next/navigation"
import { useUser } from '@auth0/nextjs-auth0/client';
import { DailyMessage, Messages } from "@/components/message";
import OptimistHeader from "@/components/OptimistHeader";

export default function Home() {
  const t = useTranslations("HomePage");

  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{t("errorLoadingUser")}</div>;
  // if (user) return redirect("/dashboard");

  if (user) { redirect("/messages") }

  return (
    <>
      {!user &&
        (
          <div id="public-layout" className="w-full max-w-4xl mx-auto px-2 sm:px-6 pt-16 flex-grow min-h-screen mb-32 overflow-x-hidden hidden-scrollbar">
            <OptimistHeader />
            <DailyMessage />
            <Messages />
          </div>
        )
      }
    </>
  );
}