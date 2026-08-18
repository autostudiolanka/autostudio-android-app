import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "press inline-flex select-none items-center justify-center gap-2 font-medium outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-sheet",
        secondary: "bg-surface-2 text-text-2",
        "primary-on-ground": "bg-primary-on-ground text-primary-on-ground-fg",
        "secondary-on-ground": "bg-raised text-muted-ground",
        icon: "bg-surface-2 text-text",
        "icon-on-ground": "bg-raised text-primary-on-ground",
      },
      shape: {
        block: "type-card-title w-full",
        inline: "type-card-title",
        round: "type-meta shrink-0",
      },
    },
    defaultVariants: { variant: "primary", shape: "inline" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { children?: ReactNode };

export function Button({ className, variant, shape = "inline", ...props }: ButtonProps) {
  const round = shape === "round";

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, shape }), className)}
      style={
        round
          ? {
              height: "var(--size-icon-button)",
              width: "var(--size-icon-button)",
              borderRadius: "var(--radius-pill)",
            }
          : {
              minHeight: "var(--size-button)",
              paddingInline: "var(--space-button-x)",
              borderRadius: "var(--radius-button)",
            }
      }
      {...props}
    />
  );
}

export { buttonVariants };