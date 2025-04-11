import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-500 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary-500 to-violet-600 text-white hover:bg-gradient-to-r hover:from-primary-600 hover:to-violet-700 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        linkedin: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-sm hover:shadow-md active:scale-[0.98] hover:translate-y-[-1px]",
        cyan: "bg-gradient-to-br from-primary-400 to-violet-500 text-white hover:from-primary-500 hover:to-violet-600 border-none shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30",
        novus: "bg-gradient-to-br from-primary-400 to-violet-500 text-white hover:from-primary-500 hover:to-violet-600 border-none shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30",
        transparent: "bg-transparent hover:bg-gray-100/20 text-gray-700 hover:text-primary-600",
        glass: "bg-white/20 backdrop-blur-sm border border-white/10 text-gray-900 hover:bg-white/30",
        minimal: "bg-transparent text-gray-700 hover:text-primary-600",
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
        "glow": "hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-shadow duration-300",
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
