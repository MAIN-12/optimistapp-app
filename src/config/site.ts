import { BookmarkIcon, HomeIcon, SearchIcon, Ticket, User, MessageCircle, Star, StarIcon, Grid, Users, BookOpen } from "lucide-react"

import { MenuItem } from "@/types";
import { Add } from "@mui/icons-material";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Optimist app",
  description: "A positive social platform where users share encouraging messages, inspirational content, and connect through circles of support. Spread optimism and build meaningful connections in a community focused on positivity.",
  url: "app.enntra.com",
  navItems: [
    { label: "Home", href: "/", },
    { label: "Pricing", href: "/pricing", },
  ],
  menuItems: [
    // {
    //   id: "home",
    //   label: "Inicio",
    //   icon: HomeIcon,
    //   path: "/",
    //   section: ["main"],
    //   // mobile: 1,
    //   className: "bg-primary hover:bg-primary-300"
    // },
    {
      id: "new",
      label: "Add New",
      icon: Add,
      path: "/send-vives",
      section: ["main", "mobile"],
      mobile: 1,
      className: "bg-primary hover:bg-primary-300"
    },

    // {
    //   id: "chat",
    //   label: "Chat",
    //   icon: MessageCircle,
    //   path: "/chat",
    //   section: ["mobile"],
    //   mobile: 2,
    // },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
      section: ["main", "mobile"],
      mobile: 2,
    },
    // {
    //   id: "journal",
    //   label: "Journal",
    //   icon: BookOpen,
    //   path: "/journal",
    //   section: ["main", "mobile"],
    //   mobile: 3,
    // },
    {
      id: "categories",
      label: "Categories",
      icon: Grid,
      path: "/categories",
      section: ["main", "mobile"],
      mobile: 4,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: StarIcon,
      path: "/favorites",
      section: ["main", "mobile"],
      mobile: 5,
    },
    {
      id: "circles",
      label: "Circles",
      icon: Users,
      path: "/circles",
      section: ["main", "mobile"],
      mobile: 6,
    },
    // {
    //   id: "profile",
    //   label: "Profile",
    //   icon: User,
    //   path: "/profile",
    //   section: ["mobile"],
    //   mobile: 5,
    // },
  ] as MenuItem[],

  links: {
    login: "/login",
    logout: "/logout",
    registry: "/signup",
    terms: "https://main12.com/terms",
    privacy: "http://main12.com/privacy",
    help: "/help",
    github: "/",
    sponsor: "/",
  },
};
