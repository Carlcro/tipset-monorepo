import React from "react";

export default function Container({ children, classNames = "" }) {
  return (
    <div className={`shadow-lg rounded-sm p-3 bg-slate ${classNames}`}>
      {children}
    </div>
  );
}
