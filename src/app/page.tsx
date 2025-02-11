import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Code, Rocket } from "lucide-react";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  // const t = useTranslations('HomePage');
  return (
    <section className="flex flex-col max-w-4xl mx-auto items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Supercharge&nbsp;</span>
        <span className={title({ color: "blue" })}>your project&nbsp;</span>
        <br />
        <span className={title()}>with a powerful Next.js template.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Built for performance, scalability, and a seamless development experience.
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Link
          className={`${buttonStyles({ variant: "bordered" })} w-full h-32 py-4 flex justify-center items-center gap-2`}
          href="/"
        >
          <Rocket className="w-6 h-6" />
          Get Started
        </Link>
        <Link
          className={`${buttonStyles({ variant: "bordered" })} w-full h-32 py-4 flex justify-center items-center gap-2`}
          href="/"
        >
          <Code className="w-6 h-6" />
          View Docs
        </Link>
      </div>

    </section>
  );
}
