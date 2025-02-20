"use client";

import { env } from "@/../env";
import { Icons } from "@/components/icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { URLBuilder } from "@/lib/builders";
import { cn, getAbsoluteURL } from "@/lib/utils";
import { ProductWithBrand } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
import { toast } from "sonner";

interface PageProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    product: ProductWithBrand;
}

export function ProductShareModal({ isOpen, setIsOpen, product }: PageProps) {
    const productUrl = getAbsoluteURL(`/products/${product.slug}`);

    const facebookShareUrl = new URLBuilder(
        "https://www.facebook.com/dialog/share"
    )
        .addQueryParam("encoding", "UTF-8")
        .addQueryParam("app_id", env.NEXT_PUBLIC_FACEBOOK_APP_ID)
        .addQueryParam("display", "popup")
        .addQueryParam("href", productUrl)
        .addQueryParam(
            "hashtag",
            `#${product.title} #${product.brand.name} #${siteConfig.name}`
        )
        .build();

    const xShareUrl = new URLBuilder("https://www.x.com/intent/tweet")
        .addQueryParam("text", `Check out this product : ${product.title}`)
        .addQueryParam("url", productUrl)
        .addQueryParam(
            "hashtags",
            `${product.title},${product.brand.name},${siteConfig.name}`
        )
        .build();

    const pinterestUrl = new URLBuilder(
        "https://www.pinterest.com/pin/create/button/"
    )
        .addQueryParam("url", productUrl)
        .addQueryParam("media", product.imageUrls[0])
        .addQueryParam(
            "description",
            product.description?.replace(/<[^>]*>/gm, "") ?? ""
        )
        .addQueryParam("method", "button")
        .build();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="md:w-auto">
                <DialogHeader>
                    <DialogTitle>Share Item</DialogTitle>
                </DialogHeader>

                <div className="flex justify-between gap-2 md:gap-5">
                    <ProductShareLink
                        icon="Mail"
                        href={`mailto:?subject=${encodeURIComponent(`Check out this product : ${product.title}`)}&body=${encodeURIComponent(productUrl)}`}
                    />

                    <ProductShareLink
                        icon="Facebook"
                        href={facebookShareUrl}
                        target="_blank"
                        img={
                            <Image
                                src="https://utfs.io/a/rwtpt6pp0i/jpHOdnohp3bMlLOzpG0mh5Agn9GfeHkd6z4CSRoaUtvPZrLY"
                                alt="Facebook"
                                width={24}
                                height={24}
                            />
                        }
                    />

                    <ProductShareLink
                        icon="X_Twitter"
                        href={xShareUrl}
                        target="_blank"
                        img={
                            <Image
                                src="https://utfs.io/a/rwtpt6pp0i/jpHOdnohp3bMoQ24asJSHBsThkUgDplYuzFyMeb7Lm2nZdW6"
                                alt="Facebook"
                                width={24}
                                height={24}
                            />
                        }
                    />

                    <ProductShareLink
                        icon="Pin"
                        href={pinterestUrl}
                        target="_blank"
                        img={
                            <Image
                                src="https://utfs.io/a/rwtpt6pp0i/jpHOdnohp3bMXqK0F5pbp6qWYAOMf8uch5UmvDxodyaw23Bg"
                                alt="Facebook"
                                width={24}
                                height={24}
                            />
                        }
                    />

                    <ProductShareLink
                        icon="Link"
                        href={productUrl}
                        onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(productUrl);
                            toast.success("Link copied to clipboard");
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface ProductShareLinkProps {
    className?: string;
    icon: keyof typeof Icons;
    href: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    target?: string;
    img?: ReactNode;
}

function ProductShareLink({
    className,
    icon,
    img,
    ...props
}: ProductShareLinkProps) {
    const Icon = Icons[icon];

    return (
        <Link
            className={cn(
                "flex size-12 items-center justify-center rounded-full border border-foreground p-2 dark:bg-foreground dark:text-background",
                className
            )}
            title={`Share via ${icon === "Pin" ? "Pinterest" : icon}`}
            {...props}
        >
            <div>{img ? img : <Icon className="size-7" />}</div>
        </Link>
    );
}
