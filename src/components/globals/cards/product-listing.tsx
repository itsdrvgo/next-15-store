"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    cn,
    convertCentToDollar,
    convertDollarToCent,
    formatPriceTag,
} from "@/lib/utils";
import { ProductWithBrand } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface PageProps extends GenericProps {
    product: ProductWithBrand;
}

export function ProductListingCard({
    className,
    product,
    ...props
}: PageProps) {
    const [isProductWishlisted, setIsProductWishlisted] = useState(false);
    const [isProductHovered, setIsProductHovered] = useState(false);
    const [isWishlistHovered, setIsWishlistHovered] = useState(false);
    const [imageIsLoading, setImageIsLoading] = useState(true);

    const [minPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
    const [maxPrice] = useQueryState(
        "maxPrice",
        parseAsInteger.withDefault(5000)
    );

    const { productPrice, priceRange } = useMemo(() => {
        if (!product.productHasVariants) {
            return {
                productPrice: product.price || 0,
                priceRange: [],
            };
        }

        const validPrices = product.variants
            .map((x) => x.price)
            .filter(
                (price) =>
                    price >= convertDollarToCent(minPrice) &&
                    price <= convertDollarToCent(maxPrice)
            )
            .sort((a, b) => a - b);

        return {
            productPrice:
                validPrices[0] ||
                Math.min(...product.variants.map((x) => x.price)),
            priceRange: validPrices,
        };
    }, [product, minPrice, maxPrice]);

    return (
        <div
            className={cn("", className)}
            title={product.title}
            {...props}
            onMouseEnter={() => setIsProductHovered(true)}
            onMouseLeave={() => setIsProductHovered(false)}
        >
            <Link
                href={`/products/${product.slug}`}
                onClick={(e) => {
                    if (isWishlistHovered) e.preventDefault();
                }}
                target="_blank"
                rel="noreferrer"
            >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    {imageIsLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Icons.Loader2 className="size-4 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    <Image
                        src={product.imageUrls[0]}
                        alt={product.title}
                        width={1000}
                        height={1000}
                        className={cn(
                            "size-full object-cover",
                            imageIsLoading ? "opacity-0" : "opacity-100"
                        )}
                        onLoad={() => setImageIsLoading(false)}
                    />

                    <div
                        className={cn(
                            "absolute bottom-0 hidden w-full p-2 transition-all ease-in-out md:inline-block",
                            isProductHovered
                                ? "translate-y-0"
                                : "translate-y-full"
                        )}
                    >
                        <Button
                            size="sm"
                            className={cn(
                                "w-full rounded-sm bg-background text-foreground hover:bg-muted hover:text-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90",
                                isProductWishlisted &&
                                    "bg-background text-primary hover:bg-muted"
                            )}
                            variant="secondary"
                            onClick={() => {
                                setIsProductWishlisted(!isProductWishlisted);
                                toast.success(
                                    isProductWishlisted
                                        ? "Removed from wishlist"
                                        : "Added to wishlist"
                                );
                            }}
                            onMouseEnter={() => setIsWishlistHovered(true)}
                            onMouseLeave={() => setIsWishlistHovered(false)}
                            {...props}
                        >
                            <Icons.Heart
                                className={cn(
                                    isProductWishlisted &&
                                        "fill-primary stroke-primary dark:fill-secondary-foreground dark:stroke-secondary-foreground"
                                )}
                            />
                            <span className="font-semibold">
                                {isProductWishlisted
                                    ? "Wishlisted"
                                    : "Wishlist"}
                            </span>
                        </Button>
                    </div>
                </div>
            </Link>

            <div className="space-y-1 py-2 md:p-2">
                <div>
                    <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-sm font-semibold">
                            {product.title}
                        </p>

                        <div className="md:hidden">
                            <Button
                                size="sm"
                                variant="secondary"
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
                                    "size-8 bg-background text-foreground hover:bg-background",
                                    isProductWishlisted && "text-primary"
                                )}
                                onMouseEnter={() => setIsWishlistHovered(true)}
                                onMouseLeave={() => setIsWishlistHovered(false)}
                                {...props}
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

                    <p className="text-xs text-muted-foreground">
                        {product.brand.name}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-semibold">
                        {formatPriceTag(
                            convertCentToDollar(productPrice),
                            true
                        )}
                        {product.productHasVariants &&
                            priceRange.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                    {" "}
                                    -{" "}
                                    {formatPriceTag(
                                        convertCentToDollar(
                                            priceRange[priceRange.length - 1]
                                        ),
                                        true
                                    )}
                                </span>
                            )}
                    </p>

                    {product.productHasVariants &&
                        priceRange.length < product.variants.length && (
                            <p className="text-xs text-muted-foreground">
                                +{product.variants.length - priceRange.length}{" "}
                                more price variants available
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
}
