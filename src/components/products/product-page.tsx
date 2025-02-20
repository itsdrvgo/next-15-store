"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ProductWithBrand } from "@/lib/validations";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { ProductContent } from "./product-content";
import { RelatedProducts } from "./related-products";

interface PageProps extends GenericProps {
    product: ProductWithBrand;
}

export function ProductPage({ className, product, ...props }: PageProps) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    return (
        <>
            <div
                className={cn("flex flex-col gap-5 lg:flex-row", className)}
                {...props}
            >
                <div className="hidden basis-3/5 grid-cols-1 gap-2 md:grid md:grid-cols-4">
                    {product.imageUrls.map((image, i) => (
                        <div
                            className={cn(
                                "aspect-square cursor-pointer overflow-hidden rounded-md",
                                i === 0 && "col-span-4 aspect-[4/3]"
                            )}
                            key={i}
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <Image
                                src={image}
                                alt={`Product image ${i + 1}`}
                                width={1000}
                                height={1000}
                                className="size-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                    className="md:hidden"
                >
                    <CarouselContent className="m-0 flex flex-row gap-4">
                        {product.imageUrls.map((image, i) => (
                            <CarouselItem
                                key={i}
                                className="p-0 text-center md:basis-1/2 lg:basis-1/4"
                            >
                                <div className="aspect-[3/4] size-full overflow-hidden rounded-md">
                                    <Image
                                        src={image}
                                        alt={`Product image ${i + 1}`}
                                        width={1000}
                                        height={1000}
                                        className="size-full object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <div className="w-px bg-border" />

                <ProductContent
                    className="basis-2/5 space-y-3 md:space-y-5"
                    product={product}
                />
            </div>

            <Separator />

            <div>
                <RelatedProducts productId={product.id} />
            </div>

            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogContent className="p-0">
                    <DialogHeader className="hidden">
                        <DialogTitle>Images of {product.title}</DialogTitle>
                    </DialogHeader>

                    <Carousel
                        plugins={[
                            Autoplay({
                                delay: 5000,
                            }),
                        ]}
                        opts={{
                            loop: true,
                            align: "start",
                        }}
                    >
                        <CarouselContent className="m-0">
                            {product.imageUrls.map((image, i) => (
                                <CarouselItem
                                    key={i}
                                    className="p-0 text-center"
                                >
                                    <div className="aspect-[3/4] size-full overflow-hidden rounded-md">
                                        <Image
                                            src={image}
                                            alt={`Product image ${i + 1}`}
                                            width={1000}
                                            height={1000}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </DialogContent>
            </Dialog>
        </>
    );
}
