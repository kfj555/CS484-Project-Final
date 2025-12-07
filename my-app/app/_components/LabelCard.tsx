import React from "react";
interface CardProps {
  children?: React.ReactNode;
  color?: string;
  shadow?: boolean;
}

// functional same as card with less rounded ends and default shadow off
const LabelCard = ({ children, color, shadow = false }: CardProps) => {
  const style: React.CSSProperties = {
    backgroundColor: color,
    boxShadow: shadow ? "1px 1px 10px 1px rgba(0, 0, 0, 0.2)" : "",
  };
  return (
    <div
      className="flex flex-col p-6 rounded-md bg-white justify-center
        min-w-[150px] max-w-[220px] flex-1 h-18"
      style={style}
    >
      {children}
    </div>
  );
};

export default LabelCard;
