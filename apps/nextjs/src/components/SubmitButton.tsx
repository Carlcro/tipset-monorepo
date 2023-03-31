import React from "react";

type Props = {
  className?: string;
  children: string;
};

export default function SubmitButton({ className = "", children }: Props) {
  return (
    <button
      className={`${className} mt-2 max-w-[260px] rounded-sm border border-polarNight bg-frost3 px-3 py-1 text-slate`}
      type="submit"
    >
      {children}
    </button>
  );
}
