"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const EmptyPlaceholder = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        isBackgroundVisible?: boolean;
        fullWidth?: boolean;
    }
>(({ className, isBackgroundVisible = true, fullWidth, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "border-foreground-100 bg-default-50 space-y-5 rounded-xl border p-10 text-center text-foreground shadow",
            !isBackgroundVisible && "bg-transparent shadow-none",
            fullWidth ? "w-full" : "max-w-md",
            className
        )}
        {...props}
    />
));
EmptyPlaceholder.displayName = "EmptyPlaceholder";

const EmptyPlaceholderIcon = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
    >
        <div className="bg-primary-200 rounded-full p-2">{children}</div>
    </div>
));
EmptyPlaceholderIcon.displayName = "EmptyPlaceholderIcon";

const EmptyPlaceholderTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-bold", className)} {...props} />
));
EmptyPlaceholderTitle.displayName = "EmptyPlaceholderTitle";

const EmptyPlaceholderDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-foreground-400 max-w-xs text-sm", className)}
        {...props}
    />
));
EmptyPlaceholderDescription.displayName = "EmptyPlaceholderDescription";

const EmptyPlaceholderContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-col items-center gap-3 text-center",
            className
        )}
        {...props}
    />
));
EmptyPlaceholderContent.displayName = "EmptyPlaceholderContent";

export {
    EmptyPlaceholder,
    EmptyPlaceholderIcon,
    EmptyPlaceholderTitle,
    EmptyPlaceholderDescription,
    EmptyPlaceholderContent,
};
