import * as React from "react"
import { cn } from "@/lib/utils"

const ChartContainer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-full overflow-hidden", className)} {...props} />
)

const ChartTooltip = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-md border bg-background p-4 text-sm shadow-md",
      className
    )}
    {...props}
  />
)

const ChartTooltipContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1", className)} {...props} />
)

const ChartLegend = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-4 flex flex-wrap justify-center gap-4", className)}
    {...props}
  />
)

const ChartLegendContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center gap-1.5", className)} {...props} />
)

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}

// Re-export all recharts components
export * from "recharts"
