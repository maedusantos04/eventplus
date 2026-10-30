import type { InputHTMLAttributes } from "react";
import "./Campo.css";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    classname?: string;
}

function Campo({
    placeholder,
    type = "text",
    className = "",
    classname = "",
    ...props
}: CampoProps) {
    const finalClass = className || classname;
    const classes = ["campo", finalClass].filter(Boolean).join(" ");

    return (
        <input
            className={classes}
            type={type}
            placeholder={placeholder || "Digite algo..."}
            {...props}
        />
    );
}

export default Campo;
