"use-client"

import { Link } from "@heroui/react";
import { button as buttonStyles } from "@heroui/react";;
// import { useTranslations } from 'next-intl';

const LoginBtn = () => {
    // const t = useTranslations('user');

    return (
        <Link
            className={buttonStyles({
                radius: "full",
                variant: "shadow",
                fullWidth: true,
            })}
            style={{ background: 'black', color: 'white' }}
            href="/api/auth/login"
        >
            login
            {/* {t('login')} */}
        </Link>
    );
}

export default LoginBtn;