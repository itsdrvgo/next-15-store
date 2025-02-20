import { brands } from "@/config/brand";
import { DISABLE_PRODUCT_CREATION } from "@/config/const";
import { generateProductSlug } from "@/lib/utils";
import { createProductSchema, productSchema } from "@/lib/validations";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const productsRouter = createTRPCRouter({
    getProducts: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(30).default(10),
                page: z.number().min(1).default(1),
                search: z.string().optional(),
                brandIds: z.array(productSchema.shape.brandId).optional(),
                minPrice: productSchema.shape.price.optional(),
                maxPrice: productSchema.shape.price.optional(),
                categoryId: productSchema.shape.categoryId.optional(),
                subcategoryId: productSchema.shape.subcategoryId.optional(),
                productTypeId: productSchema.shape.productTypeId.optional(),
                isAvailable: productSchema.shape.isAvailable.optional(),
                sortBy: z.enum(["price", "createdAt"]).optional(),
                sortOrder: z.enum(["asc", "desc"]).optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { queries } = ctx;

            const data = await queries.products.getProducts(input);
            return data;
        }),
    getProduct: publicProcedure
        .input(
            z.object({
                id: productSchema.shape.id.optional(),
                slug: productSchema.shape.slug.optional(),
                isAvailable: productSchema.shape.isAvailable.optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { queries } = ctx;

            const data = await queries.products.getProduct(input);
            if (!data)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                });

            return data;
        }),
    bulkCreateProducts: publicProcedure
        .input(z.array(createProductSchema))
        .use(({ next }) => {
            if (DISABLE_PRODUCT_CREATION)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Product creation is disabled",
                });

            return next();
        })
        .mutation(async ({ input, ctx }) => {
            const { queries } = ctx;

            const nonExistentBrands = input.filter(
                (product) =>
                    !brands.some((brand) => brand.id === product.brandId)
            );
            if (nonExistentBrands.length > 0)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Brand with id ${nonExistentBrands
                        .map((brand) => brand.brandId)
                        .join(", ")} does not exist`,
                });

            const inputWithSlug = input.map((product) => {
                const brand = brands.find(
                    (brand) => brand.id === product.brandId
                );
                if (!brand)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Brand with id ${product.brandId} does not exist`,
                    });

                const slug = generateProductSlug(product.title, brand.name);
                return { ...product, slug };
            });

            const data =
                await queries.products.bulkCreateProducts(inputWithSlug);

            return data;
        }),
    getRelatedProducts: publicProcedure
        .input(
            z.object({
                productId: z.string(),
                limit: z.number().min(1).max(12).default(10),
            })
        )
        .query(async ({ input, ctx }) => {
            const { queries } = ctx;
            const data = await queries.products.getRelatedProducts(
                input.productId,
                input.limit
            );
            return data;
        }),
});
