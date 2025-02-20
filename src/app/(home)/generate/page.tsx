"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add this import
import { brands } from "@/config/brand";
import { categories, productTypes, subcategories } from "@/config/category";
import { DISABLE_PRODUCT_GENERATION } from "@/config/const";
import { handleClientError } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [productsToGenerate, setProductsToGenerate] = useState(500);
    const [startFrom, setStartFrom] = useState(3001);

    const generateCSV = () => {
        try {
            setIsLoading(true);

            if (DISABLE_PRODUCT_GENERATION)
                throw new Error("Product generation is disabled");

            // CSV Headers
            const headers = [
                "Product Title",
                "Product Description",
                "Brand",
                "Meta Title",
                "Meta Description",
                "Meta Keywords",
                "Has Variants",
                "Category",
                "Subcategory",
                "Product Type",
                "Option1 Name",
                "Option1 Value",
                "Option2 Name",
                "Option2 Value",
                "Option3 Name",
                "Option3 Value",
                "Price",
                "Compare At Price",
                "Quantity",
                "Weight (g)",
                "Length (cm)",
                "Width (cm)",
                "Height (cm)",
                "Country Code (ISO)",
                "HS Code",
            ].join(",");

            const rows: string[] = [];

            for (let i = 0; i < productsToGenerate; i++) {
                const currentIndex = startFrom + i; // Calculate current product number
                const hasVariants = Math.random() > 0.5;
                const category =
                    categories[Math.floor(Math.random() * categories.length)];
                const validSubcategories = subcategories.filter(
                    (s) => s.categoryId === category.id
                );
                const subcategory =
                    validSubcategories[
                        Math.floor(Math.random() * validSubcategories.length)
                    ];
                const validProductTypes = productTypes.filter(
                    (pt) =>
                        pt.categoryId === category.id &&
                        pt.subcategoryId === subcategory.id
                );
                const productType =
                    validProductTypes[
                        Math.floor(Math.random() * validProductTypes.length)
                    ];
                const brand = brands[Math.floor(Math.random() * brands.length)];

                if (!hasVariants) {
                    // Generate single product with updated index
                    const row = [
                        `"Product ${currentIndex}"`,
                        `"This is product ${currentIndex} description"`,
                        brand.name,
                        `"Product ${currentIndex} - Meta Title"`,
                        `"Product ${currentIndex} - Meta Description"`,
                        // eslint-disable-next-line quotes
                        '"keyword1,keyword2,keyword3"',
                        "false",
                        category.name,
                        subcategory.name,
                        productType.name,
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        (Math.random() * 1000 + 10).toFixed(2),
                        (Math.random() * 1500 + 100).toFixed(2),
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 1000),
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 100),
                        "US",
                        "123456",
                    ].join(",");
                    rows.push(row);
                } else {
                    // Generate product with variants with updated index
                    const sizes = ["S", "M", "L", "XL"];
                    const colors = ["Red", "Blue", "Green"];

                    for (const size of sizes) {
                        for (const color of colors) {
                            const row = [
                                `"Product ${currentIndex} with Variants"`,
                                `"This is product ${currentIndex} with variants description"`,
                                brand.name,
                                `"Product ${currentIndex} with Variants - Meta Title"`,
                                `"Product ${currentIndex} with Variants - Meta Description"`,
                                // eslint-disable-next-line quotes
                                '"keyword1,keyword2,keyword3"',
                                "true",
                                category.name,
                                subcategory.name,
                                productType.name,
                                "Size",
                                size,
                                "Color",
                                color,
                                "",
                                "",
                                (Math.random() * 1000 + 10).toFixed(2),
                                (Math.random() * 1500 + 100).toFixed(2),
                                Math.floor(Math.random() * 100),
                                Math.floor(Math.random() * 1000),
                                Math.floor(Math.random() * 100),
                                Math.floor(Math.random() * 100),
                                Math.floor(Math.random() * 100),
                                "US",
                                "123456",
                            ].join(",");
                            rows.push(row);
                        }
                    }
                }
            }

            // Combine headers and rows
            const csv = [headers, ...rows].join("\n");

            // Update the download filename to include range
            const endIndex = startFrom + productsToGenerate - 1;
            const filename = `products_${startFrom}-${endIndex}.csv`;

            // Create and download the file with new name
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success("CSV file generated successfully");
        } catch (error) {
            return handleClientError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="startFrom">Start From</label>
                    <Input
                        id="startFrom"
                        type="number"
                        value={startFrom}
                        className="bg-input"
                        onChange={(e) => setStartFrom(Number(e.target.value))}
                        min={1}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="productsToGenerate">
                        Products to Generate
                    </label>
                    <Input
                        id="productsToGenerate"
                        type="number"
                        value={productsToGenerate}
                        className="bg-input"
                        onChange={(e) =>
                            setProductsToGenerate(Number(e.target.value))
                        }
                        min={1}
                        max={1000}
                    />
                </div>
            </div>

            <Button
                disabled={isLoading || DISABLE_PRODUCT_GENERATION}
                onClick={generateCSV}
            >
                Generate
            </Button>
        </div>
    );
}
