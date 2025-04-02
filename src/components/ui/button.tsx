import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:from-cyan-600 hover:to-violet-700 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        twitter: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        cyan: "bg-gradient-to-br from-teal-400 to-cyan-500 text-white hover:from-teal-500 hover:to-cyan-600 border-none shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30",
        novus: "bg-gradient-to-br from-teal-400 to-cyan-500 text-white hover:from-teal-500 hover:to-cyan-600 border-none shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30",
        "transparent": "bg-transparent hover:bg-gray-100/20 dark:hover:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400",
        "glass": "bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm border border-white/10 dark:border-gray-800/30 text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-gray-800/30",
        "minimal": "bg-transparent text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-6 text-base",
        xl: "h-14 rounded-md px-8 text-lg",
        "2xl": "h-16 rounded-md px-10 text-xl",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-slow",
        "slide-in": "group-hover:animate-slide-in-right",
        "zoom": "hover:scale-105 active:scale-95 transition-transform duration-300",
        "lift": "hover:-translate-y-1 hover:shadow-lg transition-all duration-300",
        "glow": "hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow duration-300",
        "shine": "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shine_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:shadow-lg transition-all duration-300"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
