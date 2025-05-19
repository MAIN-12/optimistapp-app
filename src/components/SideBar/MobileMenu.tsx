import type React from "react";


import { siteConfig } from "@/config/site";

const MobileBottomMenu: React.FC = () => {
  // Filter menu items for "mobile" section and sort them by the "mobile" property
  const mobileMenuItems = siteConfig.menuItems
    .filter((item) => item.section?.includes("mobile"))
    .sort((a, b) => (a.mobile ?? 0) - (b.mobile ?? 0)); // Sort by mobile order

  return (
    <nav suppressHydrationWarning className="fixed bottom-0 left-0 right-0 bg-lightBackground dark:bg-darkBackground border-t border-gray-200 px-4 py-2">
      <ul className="flex justify-between items-center">
        {mobileMenuItems.map((item) => (
          <li key={item.id} className="flex flex-col items-center">
            <item.icon className="h-6 w-6 text-gray-800 dark:text-white" />
            <span className="text-xs mt-1 text-gray-600 dark:text-white">{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomMenu;
