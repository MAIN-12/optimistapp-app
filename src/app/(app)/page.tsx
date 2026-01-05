"use client";

import { useTranslations } from "next-intl";
import Loading from "./loading";

import { redirect } from "next/navigation"
import { useUser } from '@/providers/AuthProvider';

export default function Home() {
  const t = useTranslations("HomePage");

  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{t("errorLoadingUser")}</div>;

  if (user) { redirect("/messages") }
  
  // Not logged in - redirect to login
  redirect("/login");
}