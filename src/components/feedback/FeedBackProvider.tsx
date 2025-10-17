"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";

import { useTranslations } from "./locales/getTranslations";
import { BugReport, Lightbulb, Feedback, Help } from "./icons/SupportIcons";
import BackArrowIcon from './icons/BackArrow';
import ReportBug from "./forms/ReportBug";
import ProvideFeedback from "./forms/ProvideFeedback";
import RequestFeature from "./forms/RequestFeature";
import RequestSupport from "./forms/RequestSupport";

interface SupportModalContextProps {
    openModal: (view: string) => void;
    closeModal: () => void;
    openSupportModal: () => void; // New function for default behavior
}

const SupportModalContext = createContext<SupportModalContextProps | undefined>(undefined);

export const useSupportModal = (): SupportModalContextProps => {
    const context = useContext(SupportModalContext);
    if (!context) {
        throw new Error("useSupportModal must be used within a SupportModalProvider");
    }
    return context;
};

interface SupportModalProviderProps {
    children: ReactNode;
}

export const SupportModalProvider: React.FC<SupportModalProviderProps> = ({ children }) => {
    const t = useTranslations('FeedBackModal');
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState<string>("");

    const openModal = (view: string) => {
        setCurrentView(view);
        setIsOpen(true);
    };

    const closeModal = () => {
        setCurrentView("");
        setIsOpen(false);
    };

    // New function to open the modal with a default view
    const openSupportModal = () => {
        openModal("");
    };

    const handleBackClick = () => {
        setCurrentView("");
    };

    const buttons = [
        {
            id: 'bug',
            icon: <BugReport />,
            label: t('reportBug'),
        },
        {
            id: 'feature',
            icon: <Lightbulb />,
            label: t('requestFeature'),
        },
        {
            id: 'feedback',
            icon: <Feedback />,
            label: t('provideFeedback'),
        },
        {
            id: 'Help',
            icon: <Help />,
            label: t('help'),
        },
    ];

    return (
        <SupportModalContext.Provider value={{ openModal, closeModal, openSupportModal }}>
            {children}
            <Modal
                isOpen={isOpen}
                scrollBehavior="outside"
                onOpenChange={setIsOpen}
                isDismissable={false}
                placement="center"
                // className="bg-light dark:bg-dark rounded-lg"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col">
                        {currentView !== "" ? (
                            <Button
                                onPress={handleBackClick}
                                variant="light"
                                isIconOnly
                            >
                                <BackArrowIcon />
                            </Button>
                        ) : (
                            <h2 className="text-2xl font-bold text-center">{t("title")}</h2>
                        )}
                    </ModalHeader>
                    <ModalBody>
                        {currentView === "" && (
                            <>
                                <p className="text-center mb-6">{t("intro")}</p>
                                <div className={`grid gap-4 ${buttons.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                    {buttons.map((button) => (
                                        <Button
                                            key={button.id}
                                            onPress={() => openModal(button.id)}
                                            className={`flex flex-col items-center justify-center h-20 w-full p-4 shadow-md transition-all duration-200 hover:shadow-lg ${buttons.length <= 3 ? 'aspect-[3/2]' : 'aspect-square'
                                                }`}
                                            variant="bordered"
                                        >
                                            <div className="flex flex-col items-center">
                                                {React.cloneElement(button.icon, { className: " text-3xl mb-2" })}
                                                <span className="text-center w-full break-words text-sm">{button.label}</span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )}

                        {currentView === "bug" && (<ReportBug />)}
                        {currentView === "feature" && (<RequestFeature />)}
                        {currentView === "feedback" && (<ProvideFeedback />)}
                        {currentView === "Help" && (<RequestSupport />)}
                    </ModalBody>
                    <ModalFooter className="z-[1000] rounded">
                        <p className="mt-3 text-sm text-center w-full">Powered by <a href="https://main12.com" target="_blank" rel="noopener noreferrer" className="text-blue-500">Main 12 LLC</a></p>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SupportModalContext.Provider>
    );
};