import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", {
  variants: {
    variant: {
      default: "border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-[var(--color-gold)]",
      secondary: "border-white/40 bg-white/10 text-white",
      outline: "border-[var(--color-gold-muted)] text-[var(--color-gold)]"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }