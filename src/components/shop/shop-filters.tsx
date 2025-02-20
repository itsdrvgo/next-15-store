"use client";

import { brands } from "@/config/brand";
import { categories, productTypes, subcategories } from "@/config/category";
import { cn, formatPriceTag } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import { useMotionValueEvent, useScroll } from "motion/react";
import {
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    useQueryState,
} from "nuqs";
import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { MultipleSelector } from "../ui/multi-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { Slider } from "../ui/slider";

const sortByWithOrderTypes = [
    {
        label: "Price: High to Low",
        value: "price:desc",
    },
    {
        label: "Price: Low to High",
        value: "price:asc",
    },
    {
        label: "Newest First",
        value: "createdAt:desc",
    },
    {
        label: "Oldest First",
        value: "createdAt:asc",
    },
];

const MAX_PRICE = 5000;
const MIN_PRICE = 0;

export function ShopFilters({ className, ...props }: GenericProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return isMobile ? (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button>
                        <Icons.Filter />
                        Filters
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="bottom"
                    className="h-screen overflow-auto border-none p-0"
                    style={{
                        scrollbarWidth: "none",
                    }}
                >
                    <SheetHeader className="p-4 text-start">
                        <SheetTitle>Select Filters</SheetTitle>
                    </SheetHeader>

                    <ShopFiltersSection
                        className={cn("w-auto basis-full p-4", className)}
                        {...props}
                    />
                </SheetContent>
            </Sheet>

            <Separator />
        </>
    ) : (
        <ShopFiltersSection className={cn("", className)} {...props} />
    );
}

function ShopFiltersSection({ className, ...props }: GenericProps) {
    const [search, setSearch] = useQueryState("search", { defaultValue: "" });
    const [categoryId, setCategoryId] = useQueryState("categoryId", {
        defaultValue: "",
    });
    const [subCategoryId, setSubCategoryId] = useQueryState("subcategoryId", {
        defaultValue: "",
    });
    const [productTypeId, setProductTypeId] = useQueryState("productTypeId", {
        defaultValue: "",
    });
    const [brandIds, setBrandIds] = useQueryState(
        "brandIds",
        parseAsArrayOf(parseAsString, ",").withDefault([])
    );
    const [minPrice, setMinPrice] = useQueryState(
        "minPrice",
        parseAsInteger.withDefault(MIN_PRICE)
    );
    const [maxPrice, setMaxPrice] = useQueryState(
        "maxPrice",
        parseAsInteger.withDefault(MAX_PRICE)
    );
    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        parseAsStringLiteral(["price", "createdAt"] as const).withDefault(
            "createdAt"
        )
    );
    const [sortOrder, setSortOrder] = useQueryState(
        "sortOrder",
        parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc")
    );

    const [priceRange, setPriceRange] = useState<number[]>([
        minPrice ? (minPrice < MIN_PRICE ? MIN_PRICE : minPrice) : MIN_PRICE,
        maxPrice ? (maxPrice > MAX_PRICE ? MAX_PRICE : maxPrice) : MAX_PRICE,
    ]);

    const handleSort = (value: string) => {
        const [sortBy, sortOrder] = value.split(":");
        setSortBy(sortBy as "price" | "createdAt");
        setSortOrder(sortOrder as "asc" | "desc");
    };

    const [isMenuHidden, setIsMenuHidden] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > previous && latest > 150) setIsMenuHidden(true);
        else setIsMenuHidden(false);
    });

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
        setSubCategoryId("");
        setProductTypeId("");
    };

    const handleSubCategoryChange = (value: string) => {
        setSubCategoryId(value);
        setProductTypeId("");
    };

    const hasActiveFilters =
        search.length > 0 ||
        categoryId.length > 0 ||
        subCategoryId.length > 0 ||
        productTypeId.length > 0 ||
        brandIds.length > 0 ||
        minPrice > 0 ||
        maxPrice < 5000 ||
        sortBy !== "createdAt" ||
        sortOrder !== "desc";

    const resetFilters = () => {
        setSearch("");
        setCategoryId("");
        setSubCategoryId("");
        setProductTypeId("");
        setBrandIds([]);
        setMinPrice(MIN_PRICE);
        setMaxPrice(MAX_PRICE);
        setPriceRange([MIN_PRICE, MAX_PRICE]);
        setSortBy("createdAt");
        setSortOrder("desc");
    };

    return (
        <div className={cn("", className)} {...props}>
            <div
                className={cn(
                    "space-y-4 transition-all delay-200 ease-in-out lg:sticky",
                    isMenuHidden ? "lg:top-10" : "lg:top-20"
                )}
            >
                {hasActiveFilters && (
                    <Button className="w-full" onClick={resetFilters}>
                        <Icons.RotateCcw className="mr-2 size-4" />
                        Reset Filters
                    </Button>
                )}

                <div className="space-y-1">
                    <Label
                        className="font-semibold uppercase"
                        htmlFor="category_select"
                    >
                        Category
                    </Label>

                    <Select
                        value={categoryId}
                        onValueChange={handleCategoryChange}
                        disabled={categories.length === 0}
                    >
                        <SelectTrigger className="w-full" id="category_select">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>

                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {categoryId.length > 0 && (
                    <div className="space-y-1">
                        <Label
                            className="font-semibold uppercase"
                            htmlFor="sub_select"
                        >
                            Subcategory
                        </Label>

                        <Select
                            value={subCategoryId}
                            onValueChange={handleSubCategoryChange}
                            disabled={
                                subcategories.filter(
                                    (sub) => sub.categoryId === categoryId
                                ).length === 0
                            }
                        >
                            <SelectTrigger className="w-full" id="sub_select">
                                <SelectValue placeholder="Select Sub-Category" />
                            </SelectTrigger>

                            <SelectContent>
                                {subcategories
                                    .filter(
                                        (sub) => sub.categoryId === categoryId
                                    )
                                    .map((sub) => (
                                        <SelectItem key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {subCategoryId.length > 0 && (
                    <div className="space-y-1">
                        <Label
                            className="font-semibold uppercase"
                            htmlFor="type_select"
                        >
                            Type
                        </Label>

                        <Select
                            value={productTypeId}
                            onValueChange={setProductTypeId}
                            disabled={
                                productTypes.filter(
                                    (type) =>
                                        type.subcategoryId === subCategoryId
                                ).length === 0
                            }
                        >
                            <SelectTrigger className="w-full" id="type_select">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>

                            <SelectContent>
                                {productTypes
                                    .filter(
                                        (type) =>
                                            type.subcategoryId === subCategoryId
                                    )
                                    .map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Separator />

                <div className="space-y-1">
                    <Label className="font-semibold uppercase">Brand</Label>

                    <MultipleSelector
                        commandProps={{
                            label: "Brands",
                        }}
                        defaultOptions={brands
                            .map((brand) => ({
                                label: brand.name,
                                value: brand.slug,
                            }))
                            .sort()}
                        placeholder="Select brands"
                        emptyIndicator={
                            <p className="text-center text-sm">
                                No results found
                            </p>
                        }
                        value={brands
                            .filter((brand) => brandIds.includes(brand.id))
                            .map((brand) => ({
                                label: brand.name,
                                value: brand.slug,
                            }))}
                        onChange={(options) =>
                            setBrandIds(
                                options.map(
                                    (option) =>
                                        brands.find(
                                            (brand) =>
                                                brand.slug === option.value
                                        )?.id ?? ""
                                )
                            )
                        }
                    />
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label
                            className="font-semibold uppercase"
                            htmlFor="price_slider"
                        >
                            Price
                        </Label>

                        <Slider
                            id="price_slider"
                            value={priceRange}
                            step={100}
                            onValueChange={setPriceRange}
                            onValueCommit={(values) => {
                                setMinPrice(values[0]);
                                setMaxPrice(values[1]);
                            }}
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            minStepsBetweenThumbs={1}
                            aria-label="Price range slider"
                        />
                    </div>

                    <div>
                        <Label className="tabular-nums">
                            {formatPriceTag(priceRange[0])} -{" "}
                            {formatPriceTag(priceRange[1])}
                            {priceRange[1] === 5000 && "+"}
                        </Label>
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    <Label
                        className="font-semibold uppercase"
                        htmlFor="sort_select"
                    >
                        Sort By
                    </Label>

                    <Select
                        value={`${sortBy}:${sortOrder}`}
                        onValueChange={handleSort}
                    >
                        <SelectTrigger className="w-full" id="sort_select">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>

                        <SelectContent>
                            {sortByWithOrderTypes.map((x) => (
                                <SelectItem key={x.value} value={x.value}>
                                    {x.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
