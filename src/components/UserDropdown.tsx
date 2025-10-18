'use client';

import { User, Settings, LogOut, LogOutIcon, SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0/client";
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownItem, Skeleton, Tooltip,
    useDisclosure,
    Button
} from "@heroui/react";
import SupportIcon from "@mui/icons-material/Support";

import ArrowOutward from "@/components/icons/ArrowOutward";
import { siteConfig } from "@/config/site";
import { useSupportModal } from "@/components/feedback/FeedBackProvider";

import UserAvatar from './Auth/Avatar';
import { useTranslations } from 'next-intl';

export default function UserDropdown({ children }: { children?: React.ReactNode }) {
    const { openSupportModal } = useSupportModal();
    const t = useTranslations("sidebar");

    const router = useRouter();


    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <span >
                    {children ? children : <UserAvatar size="sm" />}
                </span>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                    key="settings"
                    onPress={() => router.push('/settings')}
                    startContent={<SettingsIcon />}
                >
                    {t("settings")}
                </DropdownItem>

                <DropdownItem
                    key="profile"
                    onPress={() => router.push('/profile')}
                    startContent={<User />}
                >
                    {t("profile")}
                </DropdownItem>

                {/* <DropdownItem
                          key="theme"
                          onPress={switchTheme}
                          startContent={theme === "light" ? <MoonFilledIcon /> : <SunFilledIcon />}
                        >
                          {theme === "light" ? t("darkMode") : t("lightMode")}
                        </DropdownItem> */}

                <DropdownItem
                    key="help"
                    onPress={openSupportModal}
                    startContent={<SupportIcon />}
                >
                    {t("helpFeedback")}
                </DropdownItem>
                <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                    href={siteConfig.links.logout}
                    startContent={<LogOutIcon />}
                    showDivider
                >
                    {t("logout")}
                </DropdownItem>
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
    );
}