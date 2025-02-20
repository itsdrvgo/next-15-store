"use client";

import { brands } from "@/config/brand";
import { categories, productTypes, subcategories } from "@/config/category";
import { DISABLE_PRODUCT_CREATION } from "@/config/const";
import { trpc } from "@/lib/trpc/client";
import {
    convertDollarToCent,
    handleClientError,
    slugify,
    wait,
} from "@/lib/utils";
import { CreateProduct } from "@/lib/validations";
import { useMutation } from "@tanstack/react-query";
import { parse } from "papaparse";
import { toast } from "sonner";

interface ImportRow {
    "Product Title": string;
    "Product Description": string;
    Brand: string;
    "Meta Title": string;
    "Meta Description": string;
    "Meta Keywords": string;
    "Has Variants": string;
    Category: string;
    Subcategory: string;
    "Product Type": string;
    "Option1 Name": string;
    "Option1 Value": string;
    "Option2 Name": string;
    "Option2 Value": string;
    "Option3 Name": string;
    "Option3 Value": string;
    Price: string;
    "Compare At Price": string;
    Quantity: string;
    "Weight (g)": string;
    "Length (cm)": string;
    "Width (cm)": string;
    "Height (cm)": string;
    "Country Code (ISO)": string;
    "HS Code": string;
}

export default function Page() {
    const findCategory = (categoryName: string) => {
        const category = categories.find(
            (c) => slugify(c.name) === slugify(categoryName)
        );
        if (!category) throw new Error(`Category not found: ${categoryName}`);
        return category;
    };

    const findSubcategory = (subcategoryName: string, categoryName: string) => {
        const category = categories.find(
            (c) => slugify(c.name) === slugify(categoryName)
        );
        if (!category) throw new Error(`Category not found: ${categoryName}`);

        const subcategory = subcategories.find(
            (sc) =>
                slugify(sc.name) === slugify(subcategoryName) &&
                sc.categoryId === category.id
        );
        if (!subcategory)
            throw new Error(
                `Subcategory not found: ${subcategoryName} under category ${categoryName}`
            );

        return subcategory;
    };

    const findProductType = (
        productTypeName: string,
        subcategoryName: string,
        categoryName: string
    ) => {
        const category = categories.find(
            (c) => slugify(c.name) === slugify(categoryName)
        );
        if (!category) throw new Error(`Category not found: ${categoryName}`);

        const subcategory = subcategories.find(
            (sc) =>
                slugify(sc.name) === slugify(subcategoryName) &&
                sc.categoryId === category.id
        );
        if (!subcategory)
            throw new Error(
                `Subcategory not found: ${subcategoryName} under category ${categoryName}`
            );

        const productType = productTypes.find(
            (pt) =>
                slugify(pt.name) === slugify(productTypeName) &&
                pt.categoryId === category.id &&
                pt.subcategoryId === subcategory.id
        );
        if (!productType)
            throw new Error(
                `Product type not found: ${productTypeName} under subcategory ${subcategoryName}`
            );

        return productType;
    };

    const findBrand = (brandName: string) => {
        const brand = brands.find(
            (b) => slugify(b.name) === slugify(brandName)
        );
        if (!brand) throw new Error(`Brand not found: ${brandName}`);
        return brand;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (DISABLE_PRODUCT_CREATION)
            return toast.error("Product creation is disabled");

        const file = e.target.files?.[0];
        if (!file) return;

        processFile(file);
        e.target.value = "";
    };

    const { mutateAsync: importProuductsAsync } =
        trpc.products.bulkCreateProducts.useMutation();

    const { mutate: createBulkProducts, isPending: isCreating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Importing products...");
            return { toastId };
        },
        mutationFn: async (products: CreateProduct[]) => {
            if (!products.length) throw new Error("No products to import");
            await importProuductsAsync(products);
        },
        onSuccess: (_, __, { toastId }) => {
            return toast.success("Imported products successfully", {
                id: toastId,
            });
        },
        onError: (err, _, ctx) => {
            console.error(err);
            return handleClientError(err, ctx?.toastId);
        },
    });

    const processFile = (file: File) => {
        parse<ImportRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const toastId = toast.loading("Processing file...");

                try {
                    const productGroups = new Map<string, ImportRow[]>();

                    results.data = results.data.filter((row) => {
                        return row["Product Title"]?.trim();
                    });

                    results.data.forEach((row) => {
                        const title = row["Product Title"];
                        if (!productGroups.has(title))
                            productGroups.set(title, []);

                        productGroups.get(title)?.push(row);
                    });

                    const products: CreateProduct[] = [];

                    for (const [title, rows] of productGroups) {
                        const firstRow = rows[0];
                        const hasVariants =
                            firstRow["Has Variants"].toLowerCase() === "true";

                        const category = findCategory(firstRow.Category);
                        const subcategory = findSubcategory(
                            firstRow.Subcategory,
                            firstRow.Category
                        );
                        const productType = findProductType(
                            firstRow["Product Type"],
                            firstRow.Subcategory,
                            firstRow.Category
                        );
                        const brand = findBrand(firstRow.Brand);

                        const imageUrls = Array.from({ length: 5 }).map(
                            (_, i) =>
                                `https://picsum.photos/seed/${slugify(title)}${i}/1500/1500`
                        );

                        const product: CreateProduct = {
                            brandId: brand.id,
                            title,
                            description: firstRow["Product Description"] || "",
                            metaTitle: firstRow["Meta Title"] || "",
                            metaDescription: firstRow["Meta Description"] || "",
                            metaKeywords:
                                firstRow["Meta Keywords"]
                                    ?.split(",")
                                    .map((k) => k.trim())
                                    .filter(Boolean) || [],
                            imageUrls,
                            categoryId: category.id,
                            subcategoryId: subcategory.id,
                            productTypeId: productType.id,
                            productHasVariants: hasVariants,
                            price: 0,
                            compareAtPrice: null,
                            height: 0,
                            hsCode: null,
                            length: 0,
                            options: [],
                            originCountry: null,
                            quantity: 0,
                            variants: [],
                            weight: 0,
                            width: 0,
                        };

                        if (!hasVariants) {
                            product.price = convertDollarToCent(
                                parseFloat(firstRow["Price"]) || 0
                            );
                            product.compareAtPrice =
                                convertDollarToCent(
                                    parseFloat(firstRow["Compare At Price"]) ||
                                        0
                                ) || null;
                            product.quantity = parseInt(firstRow.Quantity) || 0;
                            product.weight =
                                parseInt(firstRow["Weight (g)"]) || 0;
                            product.length =
                                parseInt(firstRow["Length (cm)"]) || 0;
                            product.width =
                                parseInt(firstRow["Width (cm)"]) || 0;
                            product.height =
                                parseInt(firstRow["Height (cm)"]) || 0;
                            product.originCountry =
                                firstRow["Country Code (ISO)"] || null;
                            product.hsCode = firstRow["HS Code"] || null;
                        } else {
                            const optionsMap = new Map<string, Set<string>>();

                            for (const row of rows) {
                                for (let i = 1; i <= 3; i++) {
                                    const name =
                                        row[
                                            `Option${i} Name` as keyof ImportRow
                                        ];
                                    const value =
                                        row[
                                            `Option${i} Value` as keyof ImportRow
                                        ];
                                    if (name && value) {
                                        if (!optionsMap.has(name))
                                            optionsMap.set(name, new Set());
                                        optionsMap.get(name)?.add(value);
                                    }
                                }
                            }

                            product.options = Array.from(
                                optionsMap.entries()
                            ).map(([name, values], index) => ({
                                id: crypto.randomUUID(),
                                productId: crypto.randomUUID(),
                                name,
                                position: index,
                                values: Array.from(values).map(
                                    (value, vIndex) => ({
                                        id: crypto.randomUUID(),
                                        name: value,
                                        position: vIndex,
                                    })
                                ),
                                isDeleted: false,
                                deletedAt: null,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }));

                            product.variants = rows.map((row) => {
                                const combinations = product.options!.reduce(
                                    (acc, option) => {
                                        const valueForThisOption =
                                            row[
                                                `Option${option.position + 1} Value` as keyof ImportRow
                                            ];
                                        const optionValue = option.values.find(
                                            (v) => v.name === valueForThisOption
                                        );

                                        if (optionValue)
                                            acc[option.id] = optionValue.id;

                                        return acc;
                                    },
                                    {} as Record<string, string>
                                );

                                return {
                                    id: crypto.randomUUID(),
                                    productId: crypto.randomUUID(),
                                    combinations,
                                    price:
                                        convertDollarToCent(
                                            parseFloat(row["Price"]) || 0
                                        ) || 0,
                                    compareAtPrice:
                                        convertDollarToCent(
                                            parseFloat(
                                                row["Compare At Price"]
                                            ) || 0
                                        ) || null,
                                    quantity: parseInt(row.Quantity) || 0,
                                    weight: parseInt(row["Weight (g)"]) || 0,
                                    length: parseInt(row["Length (cm)"]) || 0,
                                    width: parseInt(row["Width (cm)"]) || 0,
                                    height: parseInt(row["Height (cm)"]) || 0,
                                    originCountry:
                                        row["Country Code (ISO)"] || null,
                                    hsCode: row["HS Code"] || null,
                                    image: null,
                                    isDeleted: false,
                                    deletedAt: null,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                };
                            });
                        }

                        products.push(product);
                    }

                    toast.success("File processed successfully", {
                        id: toastId,
                    });
                    await wait(1000);
                    createBulkProducts(products);
                } catch (error) {
                    return handleClientError(error, toastId);
                }
            },
        });
    };

    return (
        <div className="flex flex-1 items-center justify-center">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isCreating || DISABLE_PRODUCT_CREATION}
            />
        </div>
    );
}
