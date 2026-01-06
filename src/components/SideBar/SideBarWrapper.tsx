"use client"

// React-related imports
import { useEffect, useState } from "react";

// Internal imports (project-specific)
import SupportOptionsButton from "../SupportOptionsButton";

import Sidebar from "./sidebar";
import MobileBottomMenu from "./MobileMenu";
import MobileMenuCenterHighlight from "./MobileMenuCenterHighlight";


const SideBarWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <div className="flex hidden-scrollbar">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="relative flex flex-col flex-1 lg:overflow-y-auto lg:overflow-x-hidden hidden-scrollbar">
                {children}
                <div className="flex md:hidden ">
                    <MobileMenuCenterHighlight />
                    {/* <MobileBottomMenu /> */}
                </div>
                <div className="hidden md:block fixed bottom-4 right-4 flex items-center justify-center m-4 z-30">
                    {/* <SupportOptionsButton /> */}
                </div>
            </div>
        </div >
    )
}

export default SideBarWrapper;