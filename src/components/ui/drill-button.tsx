import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const drillButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        active:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        inactive:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
        disabled:
          "bg-disabled text-disabled-foreground cursor-not-allowed",
        success:
          "bg-success text-success-foreground hover:bg-success/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "inactive",
      size: "default",
    },
  }
);

export interface DrillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof drillButtonVariants> {}

const DrillButton = React.forwardRef<HTMLButtonElement, DrillButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(drillButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
DrillButton.displayName = "DrillButton";

export { DrillButton, drillButtonVariants };
