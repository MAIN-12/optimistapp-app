"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser, useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Dropdown, DropdownTrigger, DropdownMenu,
  DropdownItem, Skeleton, Tooltip,
  useDisclosure
} from "@heroui/react";
import LoginIcon from "@mui/icons-material/Login";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import PushPinIcon from "@mui/icons-material/PushPin";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";

import SupportModal from "../feedback/FeedBackModal";
import SettingstModal from "../SettingasModal";

import MenuButtonWithIcon from "./sidebarMenuBtn";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import ArrowOutward from "@/components/icons/ArrowOutward";
import Avatar from "@/components/Auth/Avatar";
import UserName from "@/components/Auth/UserName";
import { siteConfig } from "@/config/site";
import AppLogoExpanded from "@/components/logo/AppLogoExpanded";
import AppLogoCompact from "@/components/logo/AppLogoCompact";


export default function Sidebar() {
  const t = useTranslations("sidebar");
  const { user, isLoading } = useUser();
  const { logout } = useAuth();

  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainMenuItems = siteConfig.menuItems.filter((item) => item.section?.includes("main"));
  const bottomMenuItems = siteConfig.menuItems.filter((item) => item.section?.includes("bottom"));

  const { theme, setTheme } = useTheme();
  const switchTheme = () => { theme === "light" ? setTheme("dark") : setTheme("light"); };

  const settingsModal = useDisclosure();
  const supportModal = useDisclosure();

  // Settings Modal Handlers
  const handleOpenSettingsModal = settingsModal.onOpen;
  // const handleCloseSettingsModal = settingsModal.onClose;

  // Feedback Modal Handlers
  const handleOpenSupportModalModal = supportModal.onOpen;
  // const handleCloseSupportkModal = supportModal.onClose;

  return (
    <>
      <aside
        suppressHydrationWarning
        className="h-screen p-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`bg-sidebarlightBackground dark:bg-sidebardarkBackground h-full ${isSidebarOpen || isHovered ? "w-[250px]" : "w-16"} transition-width duration-200 text-black dark:text-white rounded-lg flex flex-col`}
        >
          {/* Logo */}
          <div className="px-4 py-6">
            <Link href="/">{isHovered || isSidebarOpen ? <AppLogoExpanded /> : <AppLogoCompact />}</Link>
          </div>

          {/* Toggle Sidebar Button */}
          {isHovered && (
            <motion.button
              className="absolute top-4 left-60 px-4 py-2  text-black dark:text-white rounded-full"
              onClick={() => {
                setIsSidebarOpen((prev) => !prev);
                setIsHovered(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ opacity: { delay: 0.3, duration: 0.3 }, }}
            >
              {isSidebarOpen ?
                <Tooltip content={t("colapseSidebar")} placement="right"><KeyboardDoubleArrowLeftIcon /></Tooltip> :
                <Tooltip content={t("pinSidebar")} placement="right"><PushPinIcon fontSize="small" /></Tooltip>
              }
            </motion.button>
          )}

          {/* Main Navigation */}
          <nav className="flex-1">
            <div className="space-y-1">
              {mainMenuItems.map((item) => (<MenuButtonWithIcon key={item.id} item={item} isExpanded={isSidebarOpen || isHovered} />))}
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className=" pt-2 pb-4 flex justify-center w-full">
            <div className="space-y-1 w-full">
              {bottomMenuItems.map((item) => (<MenuButtonWithIcon key={item.id} item={item} isExpanded={isSidebarOpen || isHovered} />))}
              {
                isLoading ? (
                  <span className="flex items-center mx-3 text-base rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:font-semibold cursor-pointer select-none">
                    <div>
                      <Skeleton className="flex rounded-full w-10 h-10" />
                    </div>
                    {
                      isSidebarOpen || isHovered && (
                        <div className="w-full flex flex-col gap-2 pl-3">
                          <Skeleton className="h-3 w-3/5 rounded-lg" />
                          <Skeleton className="h-3 w-4/5 rounded-lg" />
                        </div>
                      )
                    }
                  </span>
                ) : (
                  user ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <span className="flex items-center mx-3 text-base rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:font-semibold cursor-pointer select-none">
                          <Avatar />
                          {
                            isSidebarOpen ? (
                              <span className={`opacity-100  block ml-3 whitespace-nowrap `}><UserName /></span>
                            ) : (
                              isHovered && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.6 }}
                                  className={`ml-3 whitespace-nowrap `}
                                >
                                  <UserName />
                                </motion.span>
                              )
                            )
                          }
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        {/* <DropdownItem
                          key="settings"
                          onPress={handleOpenSettingsModal}
                          startContent={<SettingsIcon />}
                        >
                          {t("settings")}
                        </DropdownItem> */}

                        {/* <DropdownItem
                          key="theme"
                          onPress={switchTheme}
                          startContent={theme === "light" ? <MoonFilledIcon /> : <SunFilledIcon />}
                        >
                          {theme === "light" ? t("darkMode") : t("lightMode")}
                        </DropdownItem> */}

                        <DropdownItem
                          key="help"
                          onPress={handleOpenSupportModalModal}
                          startContent={<SupportIcon />}
                        >
                          {t("helpFeedback")}
                        </DropdownItem>
                        <DropdownItem
                          key="logout"
                          className="text-danger"
                          color="danger"
                          onPress={() => {
                            logout();
                            window.location.href = '/';
                          }}
                          startContent={<LogoutIcon />}
                          showDivider
                        >{t("logout")}</DropdownItem>
                        <DropdownItem key="legal" isReadOnly style={{ cursor: "default", backgroundColor: "transparent" }}>
                          <span className="flex justify-between space-x-2 text-gray-500 text-xs">
                            <a href={`${siteConfig.links.privacy}`} target="_blank" rel="noreferrer" className="hover:underline">
                              {t("Privacy Policy")}{" "}
                              <ArrowOutward
                                width="1rem"
                                className="fill-gray-500 dark:fill-gray-500"
                              />
                            </a>
                            <span>|</span>
                            <a href={`${siteConfig.links.terms}`} target="_blank" rel="noreferrer" className="hover:underline">
                              {t("Terms of Service")}{" "}
                              <ArrowOutward
                                width="1rem"
                                className="fill-gray-500 dark:fill-gray-500"
                              />
                            </a>
                          </span>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <MenuButtonWithIcon
                      title="login"
                      icon={<LoginIcon />}
                      href={siteConfig.links.login}
                      isExpanded={isSidebarOpen || isHovered}
                    />
                  ))
              }
            </div>
          </div>
        </div>
      </aside >

      <SettingstModal isOpen={settingsModal.isOpen} onOpenChange={settingsModal.onOpenChange} />
      <SupportModal isOpen={supportModal.isOpen} onOpenChange={supportModal.onOpenChange} />
    </>
  )
}
