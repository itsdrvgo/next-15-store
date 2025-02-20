"use client";

import { brands } from "@/config/brand";
import { categories, productTypes, subcategories } from "@/config/category";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ProductWithBrand } from "@/lib/validations";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import {
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    useQueryState,
} from "nuqs";
import { ProductListingCard } from "../globals/cards";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
    EmptyPlaceholder,
    EmptyPlaceholderContent,
    EmptyPlaceholderDescription,
    EmptyPlaceholderIcon,
    EmptyPlaceholderTitle,
} from "../ui/empty-placeholder";
import { Pagination } from "../ui/pagination";
import { SearchInput } from "../ui/search-input";
import { Separator } from "../ui/separator";

interface PageProps extends GenericProps {
    initialData: {
        data: ProductWithBrand[];
        count: number;
    };
}

function FilterBadges({
    categoryId,
    subcategoryId,
    productTypeId,
    brandIds,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
}: {
    categoryId: string;
    subcategoryId: string;
    productTypeId: string;
    brandIds: string[];
    minPrice: number;
    maxPrice: number;
    sortBy: string;
    sortOrder: string;
}) {
    const activeFilters = [
        categoryId && {
            id: `category-${categoryId}`,
            label: categories.find((c) => c.id === categoryId)?.name,
        },
        subcategoryId && {
            id: `subcategory-${subcategoryId}`,
            label: subcategories.find((s) => s.id === subcategoryId)?.name,
        },
        productTypeId && {
            id: `type-${productTypeId}`,
            label: productTypes.find((t) => t.id === productTypeId)?.name,
        },
        ...brandIds.map((brandId) => ({
            id: `brand-${brandId}`,
            label: brands.find((b) => b.id === brandId)?.name,
        })),
        (minPrice > 0 || maxPrice < 5000) && {
            id: "price-range",
            label: `$${minPrice} - $${maxPrice}${maxPrice === 5000 ? "+" : ""}`,
        },
        (sortBy !== "createdAt" || sortOrder !== "desc") && {
            id: "sort",
            label: `Sort: ${sortBy === "price" ? "Price" : "Date"} (${
                sortOrder === "asc" ? "Low to High" : "High to Low"
            })`,
        },
    ].filter(Boolean);

    if (!activeFilters.length) return null;

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {activeFilters.map(
                (filter) =>
                    filter && (
                        <div
                            key={filter.id}
                            className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-sm font-semibold"
                        >
                            {filter.label}
                        </div>
                    )
            )}
        </div>
    );
}

export function ShopProducts({ className, initialData, ...props }: PageProps) {
    const isScreenXl = useMediaQuery("(min-width: 1280px)");

    const [page] = useQueryState("page", parseAsInteger.withDefault(1));
    const [limit] = useQueryState("limit", parseAsInteger.withDefault(30));
    const [search] = useQueryState("search", { defaultValue: "" });
    const [brandIds] = useQueryState(
        "brandIds",
        parseAsArrayOf(parseAsString, ",").withDefault([])
    );
    const [minPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
    const [maxPrice] = useQueryState(
        "maxPrice",
        parseAsInteger.withDefault(5000)
    );
    const [categoryId] = useQueryState("categoryId", { defaultValue: "" });
    const [subCategoryId] = useQueryState("subcategoryId", {
        defaultValue: "",
    });
    const [productTypeId] = useQueryState("productTypeId", {
        defaultValue: "",
    });
    const [sortBy] = useQueryState(
        "sortBy",
        parseAsStringLiteral(["price", "createdAt"] as const).withDefault(
            "createdAt"
        )
    );
    const [sortOrder] = useQueryState(
        "sortOrder",
        parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc")
    );

    const {
        data: { data: products, count },
    } = trpc.products.getProducts.useQuery(
        {
            page,
            limit,
            search,
            isAvailable: true,
            brandIds,
            minPrice: minPrice < 0 ? 0 : minPrice,
            maxPrice: maxPrice > 5000 ? 5000 : maxPrice,
            categoryId: !!categoryId.length ? categoryId : undefined,
            subcategoryId: !!subCategoryId.length ? subCategoryId : undefined,
            productTypeId: !!productTypeId.length ? productTypeId : undefined,
            sortBy,
            sortOrder,
        },
        { initialData }
    );

    const pages = Math.ceil(count / limit) ?? 1;
    if (!products.length) return <NoProductCard />;

    return (
        <>
            {!isScreenXl && (
                <>
                    <SearchInput placeholder="Search for products..." />
                    <Separator />
                </>
            )}

            <FilterBadges
                categoryId={categoryId}
                subcategoryId={subCategoryId}
                productTypeId={productTypeId}
                brandIds={brandIds}
                minPrice={minPrice}
                maxPrice={maxPrice}
                sortBy={sortBy}
                sortOrder={sortOrder}
            />

            <div
                className={cn(
                    "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5",
                    className
                )}
                {...props}
            >
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductListingCard
                            key={product.id}
                            product={product}
                        />
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>

            <Pagination totalPages={pages} totalItems={count} />
        </>
    );
}

function NoProductCard() {
    return (
        <div className="flex flex-col items-center justify-center gap-5 p-6">
            <EmptyPlaceholder
                isBackgroundVisible={false}
                className="w-full max-w-full border-none"
            >
                <EmptyPlaceholderIcon>
                    <Icons.AlertTriangle className="size-10" />
                </EmptyPlaceholderIcon>

                <EmptyPlaceholderContent>
                    <EmptyPlaceholderTitle>
                        No products found
                    </EmptyPlaceholderTitle>
                    <EmptyPlaceholderDescription>
                        We couldn&apos;t find any products matching your search.
                        Try again with different filters.
                    </EmptyPlaceholderDescription>
                </EmptyPlaceholderContent>

                <Button asChild>
                    <Link href="/">Go back</Link>
                </Button>
            </EmptyPlaceholder>
        </div>
    );
}
