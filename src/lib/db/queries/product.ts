import { brands } from "@/config/brand";
import { categories, productTypes, subcategories } from "@/config/category";
import { convertDollarToCent } from "@/lib/utils";
import { CreateProduct, productWithBrandSchema } from "@/lib/validations";
import { and, asc, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
import { db } from "..";
import { productOptions, products, productVariants } from "../schema";

class ProductQuery {
    async getProducts({
        limit,
        page,
        search,
        brandIds,
        minPrice,
        maxPrice,
        categoryId,
        subcategoryId,
        productTypeId,
        isAvailable,
        sortBy = "createdAt",
        sortOrder = "desc",
    }: {
        limit: number;
        page: number;
        search?: string;
        brandIds?: string[];
        minPrice?: number | null;
        maxPrice?: number | null;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
        isAvailable?: boolean;
        sortBy?: "price" | "createdAt";
        sortOrder?: "asc" | "desc";
    }) {
        const searchQuery = !!search?.length
            ? sql`(
        setweight(to_tsvector('english', ${products.title}), 'A') ||
        setweight(to_tsvector('english', ${products.description}), 'B'))
        @@ plainto_tsquery('english', ${search})`
            : undefined;

        minPrice = !!minPrice ? convertDollarToCent(minPrice) : null;
        maxPrice = !!maxPrice ? convertDollarToCent(maxPrice) : null;

        const filters = [
            searchQuery,
            !!brandIds?.length
                ? inArray(products.brandId, brandIds)
                : undefined,
            !!minPrice
                ? sql`(
                    CASE 
                        WHEN ${products.productHasVariants} = true THEN
                            EXISTS (
                                SELECT 1 FROM ${productVariants} pv
                                WHERE pv.product_id = ${products.id}
                                AND pv.price >= ${minPrice}
                            )
                        ELSE
                            COALESCE(${products.price}, 0) >= ${minPrice}
                    END
                )`
                : undefined,
            !!maxPrice
                ? sql`(
                    CASE 
                        WHEN ${products.productHasVariants} = true THEN
                            EXISTS (
                                SELECT 1 FROM ${productVariants} pv
                                WHERE pv.product_id = ${products.id}
                                AND pv.price <= ${maxPrice}
                            )
                        ELSE
                            COALESCE(${products.price}, 0) <= ${maxPrice}
                    END
                )`
                : undefined,
            isAvailable !== undefined
                ? eq(products.isAvailable, isAvailable)
                : undefined,
            categoryId ? eq(products.categoryId, categoryId) : undefined,
            subcategoryId
                ? eq(products.subcategoryId, subcategoryId)
                : undefined,
            productTypeId
                ? eq(products.productTypeId, productTypeId)
                : undefined,
        ];

        const orderByPrice =
            sortBy === "price"
                ? sql`
                CASE 
                    WHEN ${products.productHasVariants} = true THEN
                        (SELECT MIN(price) FROM ${productVariants} 
                         WHERE product_id = ${products.id})
                    ELSE ${products.price}
                END
            `
                : products[sortBy];

        const data = await db.query.products.findMany({
            with: {
                variants: true,
                options: true,
            },
            where: and(...filters),
            limit,
            offset: (page - 1) * limit,
            orderBy: searchQuery
                ? [
                      sortOrder === "asc"
                          ? asc(orderByPrice)
                          : desc(orderByPrice),
                      desc(sql`ts_rank(
                        setweight(to_tsvector('english', ${products.title}), 'A') ||
                        setweight(to_tsvector('english', ${products.description}), 'B'),
                        plainto_tsquery('english', ${search})
                      )`),
                  ]
                : [
                      sortOrder === "asc"
                          ? asc(orderByPrice)
                          : desc(orderByPrice),
                  ],
            extras: {
                count: db.$count(products, and(...filters)).as("product_count"),
            },
        });

        const enhancedData = [];

        for (const product of data) {
            const productCategory = categories.find(
                (cat) => cat.id === product.categoryId
            );
            const productSubcategory = subcategories.find(
                (subcat) => subcat.id === product.subcategoryId
            );
            const productType = productTypes.find(
                (type) => type.id === product.productTypeId
            );
            const productBrand = brands.find(
                (brand) => brand.id === product.brandId
            );

            const enhancedProduct = {
                ...product,
                category: productCategory,
                subcategory: productSubcategory,
                productType,
                brand: productBrand,
            };

            enhancedData.push(enhancedProduct);
        }

        const parsed = productWithBrandSchema.array().parse(enhancedData);
        return {
            data: parsed,
            count: +data?.[0]?.count || 0,
        };
    }

    async getProduct({
        id,
        slug,
        isAvailable,
    }: {
        id?: string;
        slug?: string;
        isAvailable?: boolean;
    }) {
        if (!id && !slug) return null;

        const product = await db.query.products.findFirst({
            where: and(
                or(
                    id ? eq(products.id, id) : undefined,
                    slug ? eq(products.slug, slug) : undefined
                ),
                isAvailable ? eq(products.isAvailable, isAvailable) : undefined
            ),
            with: {
                variants: true,
                options: true,
            },
        });
        if (!product) return null;

        const productCategory = categories.find(
            (cat) => cat.id === product.categoryId
        );
        const productSubcategory = subcategories.find(
            (subcat) => subcat.id === product.subcategoryId
        );
        const productType = productTypes.find(
            (type) => type.id === product.productTypeId
        );
        const productBrand = brands.find(
            (brand) => brand.id === product.brandId
        );

        const enhancedProduct = {
            ...product,
            category: productCategory,
            subcategory: productSubcategory,
            productType,
            brand: productBrand,
        };

        const parsed = productWithBrandSchema.parse(enhancedProduct);
        return parsed;
    }

    async bulkCreateProducts(
        values: (CreateProduct & {
            slug: string;
        })[]
    ) {
        const data = await db.transaction(async (tx) => {
            const newProducts = await tx
                .insert(products)
                .values(values)
                .returning()
                .then((res) => res);

            const productOptionsToInsert = values.flatMap((value, index) =>
                value.options.map((option) => ({
                    ...option,
                    productId: newProducts[index].id,
                }))
            );
            const productVariantsToInsert = values.flatMap((value, index) =>
                value.variants.map((variant) => ({
                    ...variant,
                    productId: newProducts[index].id,
                }))
            );

            const [newOptions, newVariants] = await Promise.all([
                !!productOptionsToInsert.length
                    ? tx
                          .insert(productOptions)
                          .values(productOptionsToInsert)
                          .returning()
                    : [],
                !!productVariantsToInsert.length
                    ? tx
                          .insert(productVariants)
                          .values(productVariantsToInsert)
                          .returning()
                    : [],
            ]);

            return newProducts.map((product) => ({
                ...product,
                options: newOptions.filter((o) => o.productId === product.id),
                variants: newVariants.filter((v) => v.productId === product.id),
            }));
        });

        return data;
    }

    async getRelatedProducts(productId: string, limit = 10) {
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
        });

        if (!product) return [];

        const relatedProducts = await db.query.products.findMany({
            where: and(
                or(
                    eq(products.categoryId, product.categoryId),
                    eq(products.subcategoryId, product.subcategoryId),
                    eq(products.productTypeId, product.productTypeId)
                ),
                eq(products.isAvailable, true),
                ne(products.id, productId)
            ),
            limit,
            with: {
                variants: true,
                options: true,
            },
        });

        const enhancedData = relatedProducts.map((product) => ({
            ...product,
            brand: brands.find((brand) => brand.id === product.brandId),
            category: categories.find((cat) => cat.id === product.categoryId),
            subcategory: subcategories.find(
                (subcat) => subcat.id === product.subcategoryId
            ),
            productType: productTypes.find(
                (type) => type.id === product.productTypeId
            ),
        }));

        return productWithBrandSchema.array().parse(enhancedData);
    }
}

export const productQueries = new ProductQuery();
