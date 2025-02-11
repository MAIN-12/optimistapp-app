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
      id: "tickets",
      label: "Boletas",
      icon: Ticket,
      path: "/ticket",
      section: ["main", "mobile"],
      mobile: 4,
    },
    {
      id: "saved",
      label: "Guardado",
      icon: BookmarkIcon,
      path: "/saved",
      section: ["main", "mobile"],
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
    terms: "https://enntra.com/terminos-y-condiciones/",
    privacy: "https://enntra.com/politicas-de-privacidad/",
    help: "/help",
    github: "/",
    sponsor: "/",
  },
};
