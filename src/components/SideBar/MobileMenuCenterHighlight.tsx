import type React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const MobileMenuCenterHighlight: React.FC = () => {
  // Filter menu items for "mobile" section and sort them by the "mobile" property
  const mobileMenuItems = siteConfig.menuItems
    .filter((item) => item.section?.includes("mobile"))
    .sort((a, b) => (a.mobile ?? 0) - (b.mobile ?? 0))
    .slice(0, 5); // Limit to 5 items as requested

  // Arrange items with center highlight (first item goes to center, others fill left to right)
  const arrangeItems = () => {
    if (mobileMenuItems.length === 0) return [];
    
    const arranged = new Array(5).fill(null);
    const centerIndex = 2; // Middle position for 5 items (index 2)
    
    // Place first item in center
    if (mobileMenuItems[0]) {
      arranged[centerIndex] = { ...mobileMenuItems[0], isCenter: true };
    }
    
    // Fill remaining positions from left to right
    let currentIndex = 0;
    for (let i = 1; i < mobileMenuItems.length; i++) {
      // Skip center position
      if (currentIndex === centerIndex) {
        currentIndex++;
      }
      if (currentIndex < arranged.length) {
        arranged[currentIndex] = { ...mobileMenuItems[i], isCenter: false };
        currentIndex++;
      }
    }
    
    return arranged;
  };

  const arrangedItems = arrangeItems();

  return (
    <nav 
      suppressHydrationWarning 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 shadow-lg"
    >
      <div className="flex justify-center items-end max-w-md mx-auto">
        {arrangedItems.map((item, index) => {
          if (!item) {
            return <div key={`empty-${index}`} className="flex-1" />;
          }

          const isCenter = item.isCenter;

          return (
            <div key={item.id} className="flex-1 flex justify-center">
              <Link
                href={item.path}
                className={`
                  flex flex-col items-center justify-center transition-all duration-300 ease-in-out
                  ${isCenter 
                    ? 'relative -top-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transform hover:scale-105' 
                    : 'p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <item.icon 
                  className={`
                    ${isCenter 
                      ? 'h-8 w-8' 
                      : 'h-6 w-6'
                    }
                  `} 
                />
                {!isCenter && (
                  <span className="text-xs mt-1 font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>
      
      {/* Center item label - positioned below the highlighted button */}
      {arrangedItems[2] && (
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium bg-white dark:bg-gray-900 px-2 py-1 rounded">
            {arrangedItems[2].label}
          </span>
        </div>
      )}
    </nav>
  );
};

export default MobileMenuCenterHighlight;