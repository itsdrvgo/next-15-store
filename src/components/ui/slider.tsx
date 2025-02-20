"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

interface SliderProps
    extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    showTooltip?: boolean;
    tooltipContent?: (value: number) => React.ReactNode;
    onValueCommit?: (value: number[]) => void;
    ref?: React.Ref<HTMLSpanElement>;
}

export function Slider({
    className,
    showTooltip = false,
    tooltipContent,
    onValueCommit,
    ref: externalRef,
    ...props
}: SliderProps) {
    const [showTooltipState, setShowTooltipState] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<number[]>(
        (props.defaultValue as number[]) ?? (props.value as number[]) ?? [0]
    );
    const internalRef = React.useRef<HTMLSpanElement>(null);
    const ref = externalRef || internalRef;

    React.useEffect(() => {
        if (props.value !== undefined) {
            setInternalValue(props.value as number[]);
        }
    }, [props.value]);

    const handleValueChange = (newValue: number[]) => {
        setInternalValue(newValue);
        props.onValueChange?.(newValue);
    };

    const handlePointerDown = () => {
        if (showTooltip) {
            setShowTooltipState(true);
        }
    };

    React.useEffect(() => {
        const handleGlobalPointerUp = (event: PointerEvent) => {
            if (showTooltip) {
                setShowTooltipState(false);
            }
            if (
                ref &&
                "current" in ref &&
                ref.current &&
                ref.current.contains(event.target as Node)
            ) {
                onValueCommit?.(internalValue);
            }
        };

        document.addEventListener("pointerup", handleGlobalPointerUp);
        return () => {
            document.removeEventListener("pointerup", handleGlobalPointerUp);
        };
    }, [showTooltip, onValueCommit, internalValue, ref]);

    const renderThumb = (value: number) => {
        const thumb = (
            <SliderPrimitive.Thumb
                className="block size-5 rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onPointerDown={handlePointerDown}
            />
        );

        if (!showTooltip) return thumb;

        return (
            <TooltipProvider>
                <Tooltip open={showTooltipState}>
                    <TooltipTrigger asChild>{thumb}</TooltipTrigger>
                    <TooltipContent
                        className="border border-input bg-popover px-2 py-1 text-xs text-popover-foreground"
                        sideOffset={5}
                        side={
                            props.orientation === "vertical" ? "right" : "top"
                        }
                    >
                        <p>{tooltipContent ? tooltipContent(value) : value}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                props.orientation === "vertical" && "h-full flex-col",
                className
            )}
            onValueChange={handleValueChange}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            {internalValue?.map((value, index) => (
                <React.Fragment key={index}>
                    {renderThumb(value)}
                </React.Fragment>
            ))}
        </SliderPrimitive.Root>
    );
}
