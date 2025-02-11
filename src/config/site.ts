import { BookmarkIcon, HomeIcon, SearchIcon, Ticket, User } from "lucide-react"

import { MenuItem } from "@/types";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ENNTRA",
  description: "The easiest way to buy and sell concert tickets securely. Find great deals, sell effortlessly, and never miss your favorite events! ",
  url: "app.enntra.com",
  navItems: [
    { label: "Home", href: "/", },
    { label: "Pricing", href: "/pricing", },
  ],
  menuItems: [
    {
      id: "home",
      label: "Inicio",
      icon: HomeIcon,
      path: "/",
      section: ["main", "mobile"],
      mobile: 1,
      className: "bg-primary hover:bg-primary-300"
    },
    {
      id: "explore",
      label: "Explorar",
      icon: SearchIcon,
      path: "/explore",
      section: ["main", "mobile"],
      mobile: 2,
    },
    {
      id: "saved",
      label: "Guardado",
      icon: BookmarkIcon,
      path: "/saved",
      section: ["bottom", "mobile"],
      mobile: 3,
    },
    {
      id: "profile",
      label: "profile",
      icon: User,
      path: "/saved",
      section: ["mobile"],
      mobile: 5,
    },
  ] as MenuItem[],

  links: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    registry: "/",
    terms: "https://main12.com/terms",
    privacy: "http://main12.com/privacy",
    help: "/help",
    github: "/",
    sponsor: "/",
  },
};
