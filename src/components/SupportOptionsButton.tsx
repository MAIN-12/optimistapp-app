"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import {
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
} from "@heroui/react";
import BugReportIcon from '@mui/icons-material/BugReport';

import SupportModal from "./feedback/FeedBackModal";

const SupportOptionsButton = () => {
    const t = useTranslations('SupportOptions');

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <button
                        className="w-10 h-10 rounded-full bg-primary-500 text-black shadow-lg hover:bg-secondary-500 transition"
                        aria-label={t('openSupportOptions')}
                    >+</button>
                </DropdownTrigger>
                <DropdownMenu aria-label={t('supportActions')}>
                    <DropdownSection title={t('actions')}>
                        {/* <DropdownItem
                            key="appointment"
                            href={`/bookAppointment`}
                            startContent={<SupportAgentIcon className={iconClasses} />}
                        >
                            {t('consulting')}
                        </DropdownItem> */}
                        <DropdownItem
                            key="bug"
                            onPress={onOpen}
                            startContent={<BugReportIcon className={iconClasses} />}
                        >
                            {t('Help&feedback')}
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>

            <SupportModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
};

export default SupportOptionsButton;
