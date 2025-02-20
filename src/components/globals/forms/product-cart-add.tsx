"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, convertCentToDollar, formatPriceTag } from "@/lib/utils";
import {
    CreateCart,
    createCartSchema,
    ProductWithBrand,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
    product: ProductWithBrand;
}

export function ProductCartAddForm({ product }: PageProps) {
    const [isProductWishlisted, setIsProductWishlisted] = useState(false);
    const [selectedId, setSelectedId] = useQueryState("id", {
        defaultValue: product.variants?.[0]?.id,
    });

    const selectedVariant = useMemo(() => {
        if (!product.productHasVariants || !selectedId) return null;
        return (
            product.variants.find((variant) => variant.id === selectedId) ??
            null
        );
    }, [product.productHasVariants, product.variants, selectedId]);

    const getAvailableVariantsForOption = useCallback(
        (
            optionId: string,
            valueId: string,
            currentSelections: Record<string, string>
        ) => {
            const testSelection = {
                ...currentSelections,
                [optionId]: valueId,
            };

            return product.variants.some((variant) => {
                return Object.entries(testSelection).every(
                    ([key, value]) => variant.combinations[key] === value
                );
            });
        },
        [product.variants]
    );

    const getVariantStockByOption = useCallback(
        (
            optionId: string,
            valueId: string,
            currentSelections: Record<string, string>
        ) => {
            const matchingVariants = product.variants.filter((variant) => {
                const selections = {
                    ...currentSelections,
                    [optionId]: valueId,
                };
                return Object.entries(selections).every(
                    ([key, value]) => variant.combinations[key] === value
                );
            });

            const totalStock = matchingVariants.reduce(
                (sum, variant) => sum + (variant.quantity || 0),
                0
            );
            return totalStock;
        },
        [product.variants]
    );

    const currentSelections = useMemo(() => {
        if (!selectedVariant) return {};
        return selectedVariant.combinations;
    }, [selectedVariant]);

    const form = useForm<CreateCart>({
        resolver: zodResolver(createCartSchema),
        defaultValues: {
            productId: product.id,
            variantId: selectedVariant?.id || null,
            quantity: 1,
        },
    });

    const handleOptionSelect = useCallback(
        (optionId: string, valueId: string) => {
            const newSelections = { ...currentSelections, [optionId]: valueId };

            const matchingVariant = product.variants.find((variant) =>
                Object.entries(newSelections).every(
                    ([key, value]) => variant.combinations[key] === value
                )
            );

            if (matchingVariant) setSelectedId(matchingVariant.id);
        },
        [currentSelections, product.variants, setSelectedId]
    );

    const productPrice = useMemo(() => {
        if (!product.productHasVariants) return product.price ?? 0;
        if (!selectedVariant) return 0;

        return selectedVariant.price;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    const productCompareAtPrice = useMemo(() => {
        if (!product.productHasVariants) return product.compareAtPrice;
        if (!selectedVariant) return null;

        return productPrice > selectedVariant.price
            ? null
            : selectedVariant.compareAtPrice;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId, productPrice]);

    return (
        <>
            <div className="md:space-y-1">
                <div className="flex items-end gap-2">
                    <p className="text-2xl font-semibold md:text-3xl">
                        {formatPriceTag(
                            convertCentToDollar(productPrice),
                            true
                        )}
                    </p>

                    {productCompareAtPrice && (
                        <div className="flex items-center gap-2 text-xs font-semibold md:text-sm">
                            <p className="text-destructive line-through">
                                {formatPriceTag(
                                    convertCentToDollar(productCompareAtPrice),
                                    true
                                )}
                            </p>

                            <p className="text-muted-foreground">
                                (
                                {formatPriceTag(
                                    convertCentToDollar(
                                        productCompareAtPrice - productPrice
                                    )
                                )}{" "}
                                OFF)
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-xs font-semibold text-accent/80 md:text-sm">
                    inclusive of all taxes
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(() => {
                        if (!product.isAvailable)
                            return toast.error(
                                "Requested product is not available"
                            );

                        toast.success("Added to cart");
                    })}
                >
                    <div className="space-y-6">
                        {product.productHasVariants &&
                            product.options.map((option) => (
                                <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="variantId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-base font-semibold">
                                                {option.name}
                                            </FormLabel>

                                            <FormControl>
                                                <RadioGroup
                                                    value={
                                                        currentSelections[
                                                            option.id
                                                        ]
                                                    }
                                                    onValueChange={(value) => {
                                                        handleOptionSelect(
                                                            option.id,
                                                            value
                                                        );
                                                        const variant =
                                                            product.variants.find(
                                                                (v) =>
                                                                    Object.entries(
                                                                        {
                                                                            ...currentSelections,
                                                                            [option.id]:
                                                                                value,
                                                                        }
                                                                    ).every(
                                                                        ([
                                                                            k,
                                                                            val,
                                                                        ]) =>
                                                                            v
                                                                                .combinations[
                                                                                k
                                                                            ] ===
                                                                            val
                                                                    )
                                                            );
                                                        if (variant)
                                                            field.onChange(
                                                                variant.id
                                                            );
                                                    }}
                                                    className="flex flex-wrap gap-2"
                                                >
                                                    {option.values.map(
                                                        (value) => {
                                                            const isAvailable =
                                                                getAvailableVariantsForOption(
                                                                    option.id,
                                                                    value.id,
                                                                    currentSelections
                                                                );
                                                            const stockCount =
                                                                getVariantStockByOption(
                                                                    option.id,
                                                                    value.id,
                                                                    currentSelections
                                                                );
                                                            const lowStock =
                                                                stockCount >
                                                                    0 &&
                                                                stockCount < 5;

                                                            return (
                                                                <div
                                                                    key={
                                                                        value.id
                                                                    }
                                                                    className="flex flex-col items-center gap-2"
                                                                >
                                                                    <RadioGroupItem
                                                                        value={
                                                                            value.id
                                                                        }
                                                                        id={
                                                                            value.id
                                                                        }
                                                                        className="peer sr-only"
                                                                        disabled={
                                                                            !isAvailable ||
                                                                            stockCount ===
                                                                                0
                                                                        }
                                                                    />

                                                                    <Label
                                                                        htmlFor={
                                                                            value.id
                                                                        }
                                                                        className={cn(
                                                                            "flex cursor-pointer items-center justify-center rounded-full border p-2 px-6 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground",
                                                                            (!isAvailable ||
                                                                                stockCount ===
                                                                                    0) &&
                                                                                "cursor-not-allowed opacity-50",
                                                                            "relative"
                                                                        )}
                                                                    >
                                                                        {
                                                                            value.name
                                                                        }
                                                                    </Label>

                                                                    {lowStock && (
                                                                        <span className="whitespace-nowrap text-center text-xs text-destructive">
                                                                            Only{" "}
                                                                            {
                                                                                stockCount
                                                                            }{" "}
                                                                            left
                                                                        </span>
                                                                    )}
                                                                    {stockCount ===
                                                                        0 && (
                                                                        <span className="text-center text-xs text-destructive">
                                                                            Out
                                                                            of
                                                                            stock
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </RadioGroup>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full font-semibold uppercase md:h-12 md:basis-2/3 md:text-base"
                                disabled={
                                    !product.isAvailable ||
                                    (!!selectedVariant &&
                                        selectedVariant?.quantity === 0) ||
                                    (product.productHasVariants &&
                                        !selectedVariant)
                                }
                            >
                                <Icons.ShoppingCart />
                                {!product.isAvailable ||
                                (selectedVariant &&
                                    selectedVariant?.quantity === 0) ||
                                (product.productHasVariants && !selectedVariant)
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                            </Button>

                            <Button
                                type="button"
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    setIsProductWishlisted(
                                        !isProductWishlisted
                                    );
                                    toast.success(
                                        isProductWishlisted
                                            ? "Removed from wishlist"
                                            : "Added to wishlist"
                                    );
                                }}
                                className={cn(
                                    "group w-full border-border font-semibold uppercase hover:bg-muted hover:text-foreground dark:hover:bg-input md:h-12 md:basis-1/3 md:text-base"
                                )}
                            >
                                <Icons.Heart
                                    className={cn(
                                        isProductWishlisted &&
                                            "fill-primary stroke-primary"
                                    )}
                                />
                                <span className="sr-only font-semibold">
                                    {isProductWishlisted
                                        ? "Wishlisted"
                                        : "Wishlist"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
}
