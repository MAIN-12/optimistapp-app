"use-client"

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from "@heroui/react";
import { button as buttonStyles } from "@heroui/react";

import { siteConfig } from "@/config/site";


const RegistryBtn = () => {

    return (
        <Link
            isExternal
            className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
            })}
            style={{ color: 'black' }}
            href={siteConfig.links.registry}
        >
            Registro Gratuito
            {" "}
            <ArrowForwardIosIcon />
        </Link>
    );
}

export default RegistryBtn;