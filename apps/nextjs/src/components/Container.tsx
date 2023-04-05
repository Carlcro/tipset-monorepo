import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  classNames?: string;
};

export default function Container({ children, classNames = "" }: Props) {
  return (
    <div className={`rounded-sm bg-slate p-3 shadow-lg ${classNames}`}>
      {children}
    </div>
  );
}
