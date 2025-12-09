import Link from "next/link";
import React from "react";

interface ButtonProps {
  href?: string;
  onClick?: (() => void) | (() => Promise<void>) | null;
  children?: React.ReactNode | null;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  w?: string | number;
  h?: string | number;
}

// customizable button component, has a default (blank) styling
// can change dimensions, colors, add an onclick or provide a link to another page
const Button = ({
  href = "",
  color = "",
  hoverColor = "#e2e8f0",
  textColor = "black",
  onClick = null,
  children = null,
  h,
  w,
}: ButtonProps) => {
  const [hover, setHover] = React.useState(false);

  // dynamic styling options for button
  const style: React.CSSProperties = {
    backgroundColor: hover ? hoverColor : color,
    color: textColor,
    width: w,
    height: h,
    boxShadow: "0px 0px 1px 1px rgba(0, 0, 0, 0.2)",
  };

  // constant/default button options
  const className =
    "rounded-lg cursor-pointer bg-white px-4 py-1 flex justify-center items-center";

  const ButtonEl = //button element itself, may be wrapped with link for return
    (
      <button
        onClick={onClick ?? undefined}
        className={className}
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    );

  return href ? <Link href={href}>{ButtonEl}</Link> : ButtonEl;
};

export default Button;
