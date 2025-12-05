import React from "react";
interface CardProps {
  children?: React.ReactNode;
  hoverColor?: string;
  color?: string;
  w?: number;
  h?: number;
  shadow?: boolean;
}

const Card = ({ children, color, w, h, shadow = true }: CardProps) => {
  const style: React.CSSProperties = {
    backgroundColor: color,
    width: w,
    height: h,
    boxShadow: shadow ? "1px 1px 10px 1px rgba(0, 0, 0, 0.2)" : "",
  };
  return (
    <div
      className="flex flex-col gap-3 p-6 rounded-2xl bg-white "
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
