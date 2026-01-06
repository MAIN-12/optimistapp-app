import { MenuItem } from "@/types";
import { siteConfig } from "@/config/site";

export type MenuContext = "admin" | "company" | "account" | "general";

/**
 * Get menu items filtered by context
 */
export function getMenuItemsByContext(context: MenuContext): MenuItem[] {
  return siteConfig.menuItems.filter(item => {
    // If item has a context, check if current context is included
    if (item.context && Array.isArray(item.context)) {
      return item.context.includes(context);
    }
    // If no context specified, show in general context only
    return context === "general";
  });
}

/**
 * Get main navigation items for a specific context
 */
export function getMainMenuItems(context: MenuContext): MenuItem[] {
  return getMenuItemsByContext(context).filter(item => 
    item.section?.includes("main")
  );
}

/**
 * Get bottom navigation items for a specific context
 */
export function getBottomMenuItems(context: MenuContext): MenuItem[] {
  return getMenuItemsByContext(context).filter(item => 
    item.section?.includes("bottom")
  );
}

/**
 * Replace dynamic path parameters with actual values
 */
export function resolveDynamicPath(path: string, params: Record<string, string>): string {
  let resolvedPath = path;
  Object.entries(params).forEach(([key, value]) => {
    resolvedPath = resolvedPath.replace(`[${key}]`, value);
  });
  return resolvedPath;
}

/**
 * Get menu items with resolved dynamic paths
 */
export function getResolvedMenuItems(
  context: MenuContext, 
  params: Record<string, string> = {}
): {
  mainMenuItems: MenuItem[];
  bottomMenuItems: MenuItem[];
} {
  const mainItems = getMainMenuItems(context).map(item => ({
    ...item,
    path: resolveDynamicPath(item.path, params)
  }));

  const bottomItems = getBottomMenuItems(context).map(item => ({
    ...item,
    path: resolveDynamicPath(item.path, params)
  }));

  return {
    mainMenuItems: mainItems,
    bottomMenuItems: bottomItems
  };
}
