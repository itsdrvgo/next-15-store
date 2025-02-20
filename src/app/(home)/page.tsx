import { GeneralShell } from "@/components/globals/layouts";
import { ShopFilters, ShopProducts } from "@/components/shop";
import { Skeleton } from "@/components/ui/skeleton";
import { productQueries } from "@/lib/db/queries";
import { Suspense } from "react";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        brandIds?: string;
        minPrice?: string;
        maxPrice?: string;
        categoryId?: string;
        subCategoryId?: string;
        productTypeId?: string;
        sortBy?: "price" | "createdAt";
        sortOrder?: "asc" | "desc";
    }>;
}

export default function Page({ searchParams }: PageProps) {
    return (
        <GeneralShell>
            <div className="flex h-full flex-col gap-5 md:flex-row">
                <ShopFilters className="w-full basis-1/6" />

                <div className="hidden w-px bg-border md:inline-block" />

                <div className="w-full basis-5/6 space-y-5">
                    <Suspense fallback={<ShopProductsSkeleton />}>
                        <ShopProductsFetch searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </GeneralShell>
    );
}

async function ShopProductsFetch({ searchParams }: PageProps) {
    const {
        page: pageRaw,
        limit: limitRaw,
        search: searchRaw,
        brandIds: brandIdsRaw,
        minPrice: minPriceRaw,
        maxPrice: maxPriceRaw,
        categoryId: categoryIdRaw,
        subCategoryId: subCategoryIdRaw,
        productTypeId: productTypeIdRaw,
        sortBy: sortByRaw,
        sortOrder: sortOrderRaw,
    } = await searchParams;

    const limit =
        limitRaw && !isNaN(parseInt(limitRaw))
            ? Math.abs(parseInt(limitRaw) > 30 ? 30 : parseInt(limitRaw))
            : 30;
    const page =
        pageRaw && !isNaN(parseInt(pageRaw))
            ? Math.abs(parseInt(pageRaw) < 1 ? 1 : parseInt(pageRaw))
            : 1;
    const search = !!searchRaw?.length ? searchRaw : undefined;
    const brandIds = !!brandIdsRaw?.length ? brandIdsRaw.split(",") : undefined;
    const minPrice =
        minPriceRaw && !isNaN(parseInt(minPriceRaw))
            ? parseInt(minPriceRaw) < 0
                ? 0
                : parseInt(minPriceRaw)
            : 0;
    const maxPrice =
        maxPriceRaw && !isNaN(parseInt(maxPriceRaw))
            ? parseInt(maxPriceRaw) > 5000
                ? 5000
                : parseInt(maxPriceRaw)
            : 5000;
    const categoryId = !!categoryIdRaw?.length ? categoryIdRaw : undefined;
    const subCategoryId = !!subCategoryIdRaw?.length
        ? subCategoryIdRaw
        : undefined;
    const productTypeId = !!productTypeIdRaw?.length
        ? productTypeIdRaw
        : undefined;
    const sortBy = !!sortByRaw?.length ? sortByRaw : undefined;
    const sortOrder = !!sortOrderRaw?.length ? sortOrderRaw : undefined;

    const data = await productQueries.getProducts({
        page,
        limit,
        search,
        isAvailable: true,
        brandIds,
        minPrice,
        maxPrice,
        categoryId: !!categoryId?.length ? categoryId : undefined,
        subcategoryId: !!subCategoryId?.length ? subCategoryId : undefined,
        productTypeId: !!productTypeId?.length ? productTypeId : undefined,
        sortBy,
        sortOrder,
    });

    return <ShopProducts initialData={data} />;
}

function ShopProductsSkeleton() {
    return (
        <>
            <div className="mb-4 flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-6 w-24 rounded-full px-2.5 py-0.5"
                    />
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center">
                <Skeleton className="h-10 w-[350px]" />
            </div>
        </>
    );
}
