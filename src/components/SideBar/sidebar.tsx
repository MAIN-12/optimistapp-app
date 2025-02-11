"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@auth0/nextjs-auth0/client";
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


export default function Sidebar() {
  const t = useTranslations("sidebar");
  const { user, isLoading } = useUser();

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
        className="h-screen p-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`bg-sidebarlightBackground dark:bg-sidebardarkBackground h-full ${isSidebarOpen || isHovered ? "w-[250px]" : "w-16"} transition-width duration-200 text-black dark:text-white rounded-lg flex flex-col`}
        >
          {/* Logo */}
          <div className="px-4 py-6">
            <Link href="/">
              {
                isHovered || isSidebarOpen ?
                  (
                    <svg width="165" height="30" viewBox="0 0 132.292 24.045" xmlns="http://www.w3.org/2000/svg">
                      <path
                        className="fill-black dark:fill-white"
                        d="M-265.118 172.375c-.236-.236-.236-23.463 0-23.7.115-.114.911-.162 2.718-.162 2.52 0 2.556.004 2.684.305.072.168 1.02 3.33 2.108 7.025 1.087 3.695 2.02 6.81 2.072 6.922s.126-3.033.164-6.99l.068-7.194h3.665v23.889l-2.132.038c-1.926.034-2.143.014-2.254-.204-.068-.132-1.278-4.089-2.688-8.792l-2.564-8.552-.035 8.68c-.027 6.737-.072 8.704-.203 8.787-.282.179-3.418.134-3.603-.052m21.619-.003c-.036-.095-.05-5.487-.031-11.982l.035-11.81 2.606-.036c2.379-.034 2.618-.016 2.733.203.07.133.992 3.173 2.05 6.756s1.996 6.73 2.085 6.99c.132.386.176-.89.23-6.718l.069-7.194h3.665v23.889h-4.344l-2.328-7.737a2096 2096 0 0 0-2.646-8.755l-.32-1.018-.067 8.755-.068 8.755-1.802.038c-1.366.029-1.817-.004-1.867-.135m26.154-.013c-.112-.134-.164-2.984-.19-10.285l-.034-10.1-2.21-.037-2.21-.038.038-1.659.038-1.66h13.302l.038 1.663.038 1.663h-2.159c-1.643 0-2.196.044-2.31.183-.109.13-.162 3.095-.187 10.282l-.035 10.1-1.982.037c-1.55.029-2.017-.003-2.137-.149m16.841.02c-.129-.129-.166-2.812-.166-11.864 0-10.1.027-11.72.198-11.862.15-.124 1.173-.151 4.106-.11 4.52.063 5.382.199 6.64 1.045 1.567 1.053 2.01 2.226 2.004 5.304-.004 1.83-.042 2.202-.297 2.85-.383.976-.98 1.684-1.827 2.168l-.685.39.503.211c1.023.428 1.71 1.197 2.075 2.32.17.526.245 1.592.329 4.685.06 2.202.126 4.218.148 4.48l.04.474-1.832.04c-2.125.045-2.375.004-2.514-.411-.057-.17-.14-2.11-.186-4.312-.077-3.698-.104-4.04-.36-4.474-.452-.771-1.014-1.008-2.536-1.07-.73-.028-1.34-.03-1.357-.003s-.062 2.34-.102 5.14l-.072 5.09-1.971.037c-1.418.027-2.018-.009-2.138-.129zm7.434-13.898c.778-.454.992-.986 1.06-2.628.13-3.171-.457-3.947-2.988-3.947-.897 0-1.068.038-1.188.263-.154.287-.201 6.073-.053 6.46.134.348 2.51.237 3.169-.148m13.774 13.915c-.107-.174 4.269-23.474 4.454-23.714.188-.243 5.57-.243 5.765 0 .183.23 4.553 23.42 4.46 23.664-.06.154-.463.192-2.013.19-1.066 0-2.005-.047-2.086-.102s-.289-.985-.462-2.068c-.461-2.888-.112-2.579-2.911-2.579-2.125 0-2.387.025-2.495.238-.067.13-.26 1.123-.432 2.206s-.37 2.044-.444 2.138c-.17.217-3.703.242-3.836.027m9.073-7.968c.077-.133-1.835-11.724-1.92-11.64-.11.11-1.914 11.51-1.84 11.63.086.14 3.68.15 3.76.01m-126.685 7.305c0-.55.049-.685.272-.756.694-.22.774-1.314.136-1.85-.375-.314-.42-.426-.382-.95l.042-.593h5.837l.037 2.41.037 2.408h-5.979zm7.873-1.691c0-2.028.03-2.373.215-2.444.28-.107 15.171-.107 15.452 0 .147.057.214.257.214.635 0 .456-.076.616-.434.915-.349.292-.434.464-.434.88 0 .414.085.587.434.878.361.302.434.458.434.93v.566h-15.88zm-7.873-7.82c0-.478.054-.678.183-.678.328 0 .659-.512.659-1.019 0-.51-.332-1.018-.666-1.018-.144 0-.18-.173-.149-.712l.041-.713h5.837l.037 2.41.037 2.409h-5.979zm7.873-1.682c0-2.028.03-2.372.215-2.443.28-.108 15.171-.108 15.452 0 .147.056.214.256.214.635 0 .455-.076.616-.434.915-.349.291-.434.464-.434.878 0 .415.085.588.434.88.361.301.434.457.434.929v.567h-15.88zm-7.703-7.095c-.097-.039-.17-.306-.17-.624 0-.454.077-.62.417-.905.296-.249.419-.474.427-.783.013-.496-.347-1.127-.643-1.127-.15 0-.2-.17-.2-.679v-.678h5.972v2.36c0 2.028-.03 2.373-.215 2.444-.256.098-5.343.091-5.588-.007zm7.873 0c-.127-.051-.17-.668-.17-2.432v-2.364h15.881v.567c0 .471-.073.627-.434.93-.349.29-.434.463-.434.878s.085.587.434.879c.358.299.434.46.434.915 0 .378-.067.578-.214.635-.257.098-15.253.09-15.497-.007z"
                        transform="translate(296.908 -148.5)" />
                    </svg>
                  ) :
                  (
                    <svg width="30" height="30" viewBox="0 0 46.302 46.302" xmlns="http://www.w3.org/2000/svg">
                      <path
                        className="fill-black dark:fill-white"
                        d="M305.375 146.204c0-1.073.094-1.335.529-1.473 1.353-.43 1.51-2.561.265-3.605-.73-.613-.818-.831-.745-1.852l.083-1.158h11.377l.072 4.697.072 4.696h-11.654zm15.345-3.297c0-3.952.06-4.625.419-4.762.547-.21 29.572-.21 30.12 0 .286.11.418.5.418 1.237 0 .888-.149 1.201-.847 1.784-.68.568-.847.904-.847 1.713 0 .808.167 1.145.847 1.713.704.588.847.892.847 1.812v1.105H320.72Zm-15.346-15.242c0-.932.106-1.323.356-1.323.64 0 1.285-.997 1.285-1.984 0-.995-.647-1.984-1.298-1.984-.28 0-.35-.338-.29-1.39l.08-1.389h11.377l.072 4.697.072 4.696h-11.654zm15.346-3.279c0-3.952.06-4.624.419-4.762.547-.21 29.572-.21 30.12 0 .286.11.418.5.418 1.237 0 .888-.149 1.201-.847 1.784-.68.568-.847.905-.847 1.713s.167 1.145.847 1.713c.704.588.847.892.847 1.812v1.105H320.72zm-15.015-13.83c-.189-.076-.33-.597-.33-1.216 0-.884.148-1.208.81-1.764.579-.485.818-.923.834-1.526.026-.968-.676-2.197-1.254-2.197-.292 0-.39-.333-.39-1.323v-1.323h11.641v4.602c0 3.952-.059 4.624-.418 4.762-.499.191-10.416.178-10.893-.014m15.346 0c-.247-.099-.33-1.302-.33-4.741v-4.608h30.956v1.105c0 .92-.143 1.224-.847 1.812-.68.568-.847.905-.847 1.713s.167 1.145.847 1.713c.698.583.847.896.847 1.784 0 .738-.132 1.127-.419 1.237-.5.192-29.73.178-30.207-.014"
                        transform="translate(-305.374 -101.207)" />
                    </svg>
                  )
              }
            </Link>

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
                        <DropdownItem
                          key="settings"
                          onPress={handleOpenSettingsModal}
                          startContent={<SettingsIcon />}
                        >
                          {t("settings")}
                        </DropdownItem>

                        <DropdownItem
                          key="theme"
                          onPress={switchTheme}
                          startContent={theme === "light" ? <MoonFilledIcon /> : <SunFilledIcon />}
                        >
                          {theme === "light" ? t("darkMode") : t("lightMode")}
                        </DropdownItem>

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
                          href={siteConfig.links.logout}
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
