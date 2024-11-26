import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white shadow-sm ${className || ''}`}
      {...props}
    />
  );
}