import React from "react";
import Spinner from "./Spinner";
import Image from "next/image";

type Props = {
  className?: string;
  children: string;
  type: "submit" | "button" | "reset" | undefined;
  onClick?: () => void;
  isLoading?: boolean;
};

export default function SubmitButton({
  className = "",
  children,
  type = "submit",
  onClick,
  isLoading = false,
}: Props) {
  return (
    <button
      className={`${className} mt-2 h-[33px] w-[100px] cursor-pointer rounded-sm border border-polarNight bg-frost3 px-3 py-1 text-slate`}
      onClick={onClick}
      type={type}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex justify-center">
          <Image
            className="animate-spin-slow"
            alt="image of a football"
            src="/ball.svg"
            height={20}
            width={20}
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
