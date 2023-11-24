import { cn } from "@/utils";
import { PropsWithChildren } from "react";

export function Card({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <article
      className={cn(
        "block max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow",
        className,
      )}
    >
      {children}
    </article>
  );
}
