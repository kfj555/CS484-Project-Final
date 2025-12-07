import React from "react";
interface CardProps {
  children?: React.ReactNode;
  color?: string;
  shadow?: boolean;
  hover?: boolean;
}

// Card component is entirely for design
// div on the outside to adjust width and height
// div on the inside for spacing between children
// change color as prop input
// manually disable shadow as input prop
const Card = ({ children, color, shadow = true, hover = false }: CardProps) => {
  const style: React.CSSProperties = {
    backgroundColor: color,
    boxShadow: shadow ? "1px 1px 10px 1px rgba(0, 0, 0, 0.2)" : "",
  };
  const hoverStyle = hover
    ? "transition-all duration-300 transform hover:translate-y-[-10px] hover:shadow-3xl"
    : "";
  return (
    <div
      className={`flex flex-col p-6 h-full rounded-2xl bg-white w-full justify-start ${hoverStyle}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
