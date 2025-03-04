import { useTranslations } from "next-intl";

export const Disclaimer = () => {
    const t = useTranslations('FeedBackModal');

    return (
        <p className="text-xs mt-6">
            {t("disclaimer.text")} &nbsp;
            <a href="https://main12.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 font-bold">
                {t("disclaimer.company")}
            </a>.
            {t("disclaimer.moreInfo")} &nbsp;
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-500 font-bold">
                {t("disclaimer.privacyPolicy")}
            </a>&nbsp;
            {t("disclaimer.and")}&nbsp;
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-gray-500 font-bold">
                {t("disclaimer.termsOfService")}
            </a>.&nbsp;
            {t("disclaimer.contactInfo")}
        </p>
    );
};
