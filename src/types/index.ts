import type { LucideIcon } from "lucide-react"

import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
  section?: Array<"main" | "bottom" | "mobile">;
  mobile?: number;
  className?: string
}