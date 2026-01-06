"use client"

import { useTranslations } from "next-intl";
import { Tooltip, Tabs, Tab } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { getResolvedMenuItems, MenuContext } from "@/lib/menu-utils";

interface SidebarProps {
  context?: MenuContext;
  dynamicParams?: Record<string, string>;
}

export default function Sidebar({ context = "general", dynamicParams = {} }: SidebarProps) {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const router = useRouter();

  const { mainMenuItems, bottomMenuItems } = getResolvedMenuItems(context, dynamicParams);

  // Get current active tab based on pathname
  const getActiveTab = () => {
    if (!pathname) return undefined;

    // Find the menu item that best matches the current pathname
    let activeItem = null;

    // First try exact match
    activeItem = mainMenuItems.find(item => pathname === item.path);

    if (!activeItem) {
      // Then try to find the best matching path by checking which menu item path
      // the current pathname starts with, preferring longer matches
      const matchingItems = mainMenuItems.filter(item => {
        if (item.path === '/') {
          return pathname === '/';
        }
        return pathname.startsWith(item.path);
      });

      // Sort by path length (longest first) to get the most specific match
      matchingItems.sort((a, b) => b.path.length - a.path.length);
      activeItem = matchingItems[0];
    }

    // Return undefined if no match found (no item should be active)
    return activeItem?.id || undefined;
  };

  const handleTabChange = (key: string) => {
    const item = mainMenuItems.find(item => item.id === key);
    if (item?.path) {
      router.push(item.path);
    }
  };

  return (
    <>
      <div className="hidden md:block z-[50] sticky top-0">
        <aside className="pr-4">
          <div className="pt-4 w-20 text-black dark:text-white rounded-lg flex flex-col relative">
            
            {/* Main Navigation using HERO UI Tabs */}
            <nav className="flex-1 px-2">
              <Tabs
                selectedKey={getActiveTab() || ""}
                onSelectionChange={(key) => handleTabChange(key as string)}
                isVertical={true}
                variant="light"
                color="primary"
                className="w-full h-full"
                classNames={{
                  base: "w-full h-full flex",
                  tabList: "gap-1 w-full flex-col bg-transparent p-0",
                  cursor: "w-full shadow-md bg-primary rounded-lg",
                  tab: "w-full h-12 px-0 data-[hover-unselected=true]:opacity-80",
                  tabContent: `w-full group-data-[selected=true]:text-primary-foreground text-black dark:text-white font-light`
                }}
              >
                {mainMenuItems.map((item) => (
                  <Tab
                    key={item.id}
                    title={
                      <Tooltip content={item.label} placement="right">
                        <div className="flex items-center justify-center w-full">
                          <item.icon className="w-5 h-5 pointer-events-none flex-shrink-0" />
                        </div>
                      </Tooltip>
                    }
                  />
                ))}
              </Tabs>
            </nav>

            {/* Bottom Navigation */}
            {bottomMenuItems.length > 0 && (
              <div className="pt-2 pb-4 px-2 w-full">
                <Tabs
                  isVertical={true}
                  variant="light"
                  color="primary"
                  className="w-full"
                  classNames={{
                    base: "w-full flex",
                    tabList: "gap-1 w-full flex-col bg-transparent p-0",
                    cursor: "w-full shadow-md bg-primary rounded-lg",
                    tab: "w-full h-12 px-0 data-[hover-unselected=true]:opacity-80",
                    tabContent: `w-full group-data-[selected=true]:text-primary-foreground text-black dark:text-white font-light`
                  }}
                >
                  {bottomMenuItems.map((item) => (
                    <Tab
                      key={item.id}
                      title={
                        <Tooltip content={item.label} placement="right">
                          <div className="flex items-center justify-center w-full">
                            <item.icon className="w-5 h-5 pointer-events-none flex-shrink-0" />
                          </div>
                        </Tooltip>
                      }
                    />
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </aside >
      </div>
      <div className="hidden md:block " />
    </>
  )
}
