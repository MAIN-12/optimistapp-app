import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { DollarSign, ShoppingCart } from "lucide-react";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  // const t = useTranslations('HomePage');
  return (
    <section className="flex flex-col max-w-4xl mx-auto items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Consigue&nbsp;</span>
        <span className={title({ color: "yellow" })}>las mejores&nbsp;</span>
        <br />
        <span className={title()}>entradas para conciertos a precios inmejorables.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Compra y revende entradas de forma segura y sin complicaciones.
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Link
          className={`${buttonStyles({ variant: "bordered" })} w-full h-32 py-4 flex justify-center items-center gap-2`}
          href="/"
        >
          <ShoppingCart className="w-6 h-6" />
          Comprar
        </Link>
        <Link
          className={`${buttonStyles({ variant: "bordered" })} w-full h-32 py-4 flex justify-center items-center gap-2`}
          href="/"
        >
          <DollarSign className="w-6 h-6" />
          Vender
        </Link>
      </div>
    </section>
  );
}
