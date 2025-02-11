// components/SupportModal.tsx
import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/react";
import { useTranslations } from 'next-intl';

import { ThemeSwitch } from "./theme-switch";
import LanguageSwitcher from "./LanguageSwitcher";

interface SupportModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const SettingstModal: React.FC<SupportModalProps> = ({ isOpen, onOpenChange }) => {
    const t = useTranslations('sidebar');

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>
                    < h3>{t("settings")}</h3>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        {/* Example Settings Options */}
                        <div className="flex justify-between">
                            <p>{t("darkMode")}</p>
                            <ThemeSwitch />
                        </div>
                        <div className="flex justify-between">
                            <p>{t("Lenguage")}</p>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal >
    );
};

export default SettingstModal;
