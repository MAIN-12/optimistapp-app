"use client"

import type { MenuItem } from "@/types";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";

interface ButtonWithIconProps {
    item?: MenuItem;
    title?: string;
    icon?: React.ReactNode;
    as?: any;
    href?: string;
    onClick?: () => void;
    isExpanded: boolean;
    className?: string;
}

const MenuButtonWithIcon: React.FC<ButtonWithIconProps> = (
    { item, title, icon, as = Link, href, onClick, isExpanded = true, className, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const path = href || item?.path;
    const isActive = pathname === path;

    const handleClick = () => {
        setIsLoading(true);
        if (onClick) { onClick(); }
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center mx-auto w-full px-2 py-1">
            <Button
                as={as}
                onPress={handleClick}
                isLoading={isLoading}
                href={item ? item.path : href}
                className={`flex items-center w-full bg-black text-white rounded-full hover:bg-gray-800 font-light hover:font-semibold 
        transition-all duration-300 ease-in-out ${isExpanded ? "px-4 py-3 w-full" : "px-2 w-10"} ${isActive && ""} ${item?.className} ${className}`}
                startContent={icon ? icon : item?.icon ? <item.icon className="w-5 h-5" /> : null}
                isIconOnly={!isExpanded}
            >
                {isExpanded && (
                    <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"}`}>
                        {item?.label || title}
                    </span>
                )}
            </Button>
        </div>
    );
};

export default MenuButtonWithIcon