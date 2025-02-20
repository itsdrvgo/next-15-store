"use client";

import { Icons } from "@/components/icons";
import { RichTextViewer } from "@/components/ui/rich-text-viewer";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ProductWithBrand } from "@/lib/validations";
import { useState } from "react";
import { ProductCartAddForm } from "../globals/forms";
import { ProductShareModal } from "../globals/modals";

interface PageProps extends GenericProps {
    product: ProductWithBrand;
}

export function ProductContent({ className, product, ...props }: PageProps) {
    const [isProductShareModalOpen, setIsProductShareModalOpen] =
        useState(false);

    return (
        <>
            <div className={cn("", className)} {...props}>
                <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl font-semibold md:text-4xl">
                            {product.title}
                        </h2>

                        <button
                            className="mt-2"
                            onClick={() => setIsProductShareModalOpen(true)}
                        >
                            <span className="sr-only">Share</span>
                            <Icons.Share className="size-5" />
                        </button>
                    </div>

                    <div className="w-min whitespace-nowrap rounded-md bg-accent p-1 px-2 text-xs text-accent-foreground md:text-sm">
                        {product.brand.name}
                    </div>
                </div>

                <Separator />

                <ProductCartAddForm product={product} />

                <Separator />

                <RichTextViewer content={product.description ?? "<p></p>"} />
            </div>

            <ProductShareModal
                isOpen={isProductShareModalOpen}
                setIsOpen={setIsProductShareModalOpen}
                product={product}
            />
        </>
    );
}
