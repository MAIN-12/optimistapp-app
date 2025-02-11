"use client"

// React-related imports
import { useEffect, useState } from "react";

// Internal imports (project-specific)
import SupportOptionsButton from "../SupportOptionsButton";

import Sidebar from "./sidebar";
import MobileBottomMenu from "./MobileMenu";


const SideBarWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <div className="flex h-screen">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="relative flex flex-col flex-1 lg:overflow-y-auto lg:overflow-x-hidden">
                {isMobile ? (<>
                    <MobileBottomMenu />
                </>
                ) : (
                    <div className="fixed bottom-4 right-4 flex items-center justify-center m-4 z-30">
                        <SupportOptionsButton />
                    </div>
                )
                }
                {children}
            </div>
        </div>
    )
}

export default SideBarWrapper;