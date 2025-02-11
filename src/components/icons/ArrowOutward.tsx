import { IconSvgProps } from "@/types";

const ArrowOutward = ({ strokeWidth = 0.1, className = '', ...otherProps }: IconSvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            viewBox="0 -960 960 960"
            width="1.5em"
            height="1.5em"
            className="inline-block"
            fill="gray"
            {...otherProps}
        >
            <path
                d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"
                className={`fill-black dark:fill-white ${className}`}
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

export default ArrowOutward;
