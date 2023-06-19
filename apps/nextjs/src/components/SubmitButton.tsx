import React from "react";

type Props = {
  className?: string;
  children: string;
  type: "submit" | "button" | "reset" | undefined;
  onClick?: () => void;
};

export default function SubmitButton({
  className = "",
  children,
  type = "submit",
  onClick,
}: Props) {
  return (
    <button
      className={`${className} mt-2 max-w-[260px] rounded-sm border border-polarNight bg-frost3 px-3 py-1 text-slate`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
