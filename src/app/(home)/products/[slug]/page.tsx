import { GeneralShell } from "@/components/globals/layouts";
import { ProductPage } from "@/components/products";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { productQueries } from "@/lib/db/queries";
import { getAbsoluteURL } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const existingProduct = await productQueries.getProduct({ slug });
    if (!existingProduct)
        return {
            title: "Product not found",
            description: "The requested product was not found.",
        };

    return {
        title: !!existingProduct.metaTitle?.length
            ? existingProduct.metaTitle
            : `${existingProduct.title} by ${existingProduct.brand.name}`,
        description: !!existingProduct.metaDescription?.length
            ? existingProduct.metaDescription
            : existingProduct.description,
        authors: [
            {
                name: existingProduct.brand.name,
                url: getAbsoluteURL(`/brands/${existingProduct.brand.id}`),
            },
        ],
        openGraph: {
            type: "website",
            locale: "en_US",
            url: getAbsoluteURL(`/products/${slug}`),
            title: !!existingProduct.metaTitle?.length
                ? existingProduct.metaTitle
                : `${existingProduct.title} by ${existingProduct.brand.name}`,
            description:
                (!!existingProduct.metaDescription?.length
                    ? existingProduct.metaDescription
                    : existingProduct.description) ?? "",
            siteName: siteConfig.name,
            images: [
                {
                    url: existingProduct.imageUrls[0],
                    alt: existingProduct.title,
                    height: 1000,
                    width: 1000,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: !!existingProduct.metaTitle?.length
                ? existingProduct.metaTitle
                : `${existingProduct.title} by ${existingProduct.brand.name}`,
            description:
                (!!existingProduct.metaDescription?.length
                    ? existingProduct.metaDescription
                    : existingProduct.description) ?? "",
            images: [
                {
                    url: existingProduct.imageUrls[0],
                    alt: existingProduct.title,
                    height: 1000,
                    width: 1000,
                },
            ],
        },
    };
}

export default function Page({ params }: PageProps) {
    return (
        <GeneralShell
            classNames={{
                innerWrapper: "space-y-10",
            }}
        >
            <Suspense fallback={<ProductPageSkeleton />}>
                <ProductFetch params={params} />
            </Suspense>
        </GeneralShell>
    );
}

async function ProductFetch({ params }: PageProps) {
    const { slug } = await params;

    const existingProduct = await productQueries.getProduct({ slug });
    if (!existingProduct) notFound();

    return <ProductPage product={existingProduct} />;
}

function ProductPageSkeleton() {
    return (
        <div className="flex flex-col gap-5 lg:flex-row">
            <div className="hidden basis-3/5 grid-cols-1 gap-2 md:grid md:grid-cols-4">
                <Skeleton className="col-span-4 aspect-[4/3] w-full rounded-md" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="aspect-square w-full rounded-md"
                    />
                ))}
            </div>

            <Skeleton className="aspect-[3/4] w-full rounded-md md:hidden" />

            <div className="w-px bg-border" />

            <div className="basis-2/5 space-y-5">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>

                <Skeleton className="h-10 w-32" />

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="space-y-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
