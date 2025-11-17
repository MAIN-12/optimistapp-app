import type React from "react"
import type { Media } from "@/payload-types"

import { AnimatedTwoColumn } from './Component.client'

type TwoColumnTextImageProps = {
  richText: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ("ltr" | "rtl") | null
      format: "left" | "start" | "center" | "right" | "end" | "justify" | ""
      indent: number
      version: number
    }
    [k: string]: unknown
  }
  media: number | Media
  imagePosition?: ("left" | "right") | null
  links?:
  | {
    type?: ("reference" | "custom") | null
    reference?: {
      relationTo: "pages"
      value: number | any
    } | null
    url?: string | null
    label: string
    appearance?: ("default" | "primary" | "secondary" | "outline" | "link") | null
    id?: string | null
  }[]
  | null
  id?: string | null
  blockName?: string | null
  blockType: "twoColumnTextImage"
}

export const TwoColumnTextImage: React.FC<TwoColumnTextImageProps> = (props) => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedTwoColumn {...props} />
        </div>
      </div>
    </section>
  )
}
