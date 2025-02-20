"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn, convertCentToDollar, formatPriceTag } from "@/lib/utils";
import { ProductWithBrand } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps extends GenericProps {
    product: ProductWithBrand;
}

export function RelatedProductCard({
    className,
    product,
    ...props
}: ProductCardProps) {
    const [isProductWishlisted, setIsProductWishlisted] = useState(false);
    const [isWishlistHovered, setIsWishlistHovered] = useState(false);
    const [imageIsLoading, setImageIsLoading] = useState(true);

    const productPrice = product.productHasVariants
        ? Math.min(...product.variants.map((v) => v.price))
        : product.price || 0;

    return (
        <div className={cn("group relative", className)} {...props}>
            <Link
                href={`/products/${product.slug}`}
                onClick={(e) => {
                    if (isWishlistHovered) e.preventDefault();
                }}
                className="block"
            >
                <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                    {imageIsLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Icons.Loader2 className="size-4 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    <Image
                        src={product.imageUrls[0]}
                        alt={product.title}
                        width={500}
                        height={500}
                        className={cn(
                            "size-full object-cover transition-transform duration-300 group-hover:scale-105",
                            imageIsLoading ? "opacity-0" : "opacity-100"
                        )}
                        onLoad={() => setImageIsLoading(false)}
                    />

                    <Button
                        size="icon"
                        variant="secondary"
                        className={cn(
                            "absolute right-2 top-2 size-8 bg-background/80 text-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100",
                            isProductWishlisted && "text-primary opacity-100"
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsProductWishlisted(!isProductWishlisted);
                            toast.success(
                                isProductWishlisted
                                    ? "Removed from wishlist"
                                    : "Added to wishlist"
                            );
                        }}
                        onMouseEnter={() => setIsWishlistHovered(true)}
                        onMouseLeave={() => setIsWishlistHovered(false)}
                    >
                        <Icons.Heart
                            className={cn(
                                "size-4",
                                isProductWishlisted &&
                                    "fill-primary stroke-primary"
                            )}
                        />
                        <span className="sr-only">
                            {isProductWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"}
                        </span>
                    </Button>
                </div>

                <div className="mt-2 space-y-1">
                    <h3 className="line-clamp-1 text-sm font-medium">
                        {product.title}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        {product.brand.name}
                    </p>

                    <p className="text-sm font-medium">
                        {formatPriceTag(
                            convertCentToDollar(productPrice),
                            true
                        )}
                    </p>
                </div>
            </Link>
        </div>
    );
}
