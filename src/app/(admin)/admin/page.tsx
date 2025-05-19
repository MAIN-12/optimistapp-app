import ChatInterface from '@/components/chat/Chat';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <section
    // className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
    >
      {/* <h1>{t("title")}</h1> */}

      <ChatInterface />
    </section>
  );
}