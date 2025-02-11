/* eslint-disable @next/next/no-img-element */

"use client";

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { useTranslations, useLocale } from 'next-intl';

type Flags = { [key: string]: string; };

const flags: Flags = {
    es: "https://flagsapi.com/CO/flat/64.png",
    en: "https://flagsapi.com/US/flat/64.png"
}

const LanguageSwitcher: FC = () => {
    const router = useRouter();
    const t = useTranslations('LanguageSwitcher');
    const locale = useLocale();

    const handleLanguageChange = (newLocale: string) => {
        // Construct the new URL with the new locale
        const currentPath = new URL(window.location.href);
        const pathParts = currentPath.pathname.split('/');

        // Replace the current locale segment with the new locale
        pathParts[1] = newLocale;

        // Construct the new URL with the updated path
        const newPath = pathParts.join('/');

        router.push(newPath);
    };

    const localeOptions = ['en', 'es']; // Example locales, replace with your supported locales
    const selectedLocaleKeys = new Set<string>([locale]);

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light" className='rounded-full m-0 p-0'>
                    {/* {t('currentLanguage')} ({locale}) */}

                    <div className="flex items-center justify-center w-7 h-7 rounded-full overflow-hidden">
                        <img
                            src={flags[locale as keyof Flags]}
                            alt={`${locale} flag`}
                            className="object-cover w-full h-full"
                            style={{ transform: `scale(1.6)` }}
                        />
                    </div>

                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label={t('languageMenu')}
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedLocaleKeys}
                onAction={(key) => handleLanguageChange(key as string)}
            >
                {localeOptions.map((lang) => (
                    <DropdownItem key={lang} onClick={() => handleLanguageChange(lang)}>
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full overflow-hidden mr-2 relative">
                                <img
                                    src={flags[lang as keyof Flags]}
                                    alt={`${lang} flag`}
                                    className="object-cover w-full h-full transform scale-150"
                                />
                            </div>
                            {t(lang)}
                        </div>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default LanguageSwitcher;
