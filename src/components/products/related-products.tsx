"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { RelatedProductCard } from "./related-product-card";

interface RelatedProductsProps extends GenericProps {
    productId: string;
}

export function RelatedProducts({
    productId,
    className,
    ...props
}: RelatedProductsProps) {
    const { data: relatedProducts, isLoading } =
        trpc.products.getRelatedProducts.useQuery({
            productId,
            limit: 10,
        });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Related Products</h2>

                <Carousel>
                    <CarouselContent>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <CarouselItem
                                key={i}
                                className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                <Skeleton className="aspect-[3/4] w-full" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        );
    }

    if (!relatedProducts?.length) return null;

    return (
        <div className={cn("space-y-4", className)} {...props}>
            <h2 className="text-2xl font-bold">Related Products</h2>

            <Carousel>
                <CarouselContent>
                    {relatedProducts.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                        >
                            <RelatedProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-0 h-full rounded-none border-none bg-gradient-to-r from-background to-transparent hover:from-background hover:to-transparent" />
                <CarouselNext className="right-0 h-full rounded-none border-none bg-gradient-to-l from-background to-transparent" />
            </Carousel>
        </div>
    );
}
