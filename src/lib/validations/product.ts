import { z } from "zod";
import { convertEmptyStringToNull } from "../utils";

export const productOptionValueSchema = z.object({
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, "Name must be at least 1 characters long"),
    position: z
        .number({
            required_error: "Position is required",
            invalid_type_error: "Position must be a number",
        })
        .int("Position must be an integer")
        .nonnegative("Position must be a non-negative number"),
});

export const productSchema = z.object({
    // BASIC INFO
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
        .min(3, "Title must be at least 3 characters long"),
    slug: z
        .string({
            required_error: "Slug is required",
            invalid_type_error: "Slug must be a string",
        })
        .min(3, "Slug must be at least 3 characters long"),
    description: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Description must be a string",
            })
            .min(3, "Description must be at least 3 characters long")
            .nullable()
    ),
    brandId: z
        .string({
            required_error: "Brand ID is required",
            invalid_type_error: "Brand ID must be a string",
        })
        .uuid("Brand ID is invalid"),
    isAvailable: z.boolean({
        required_error: "Availability is required",
        invalid_type_error: "Availability must be a boolean",
    }),
    imageUrls: z
        .array(
            z
                .string({
                    required_error: "Image URL is required",
                    invalid_type_error: "Image URL must be a string",
                })
                .url("Image URL is invalid")
        )
        .min(1, "At least one image URL is required"),
    productHasVariants: z.boolean({
        required_error: "Product has variants status is required",
        invalid_type_error: "Product has variants status must be a boolean",
    }),

    // CATEGORY
    categoryId: z
        .string({
            required_error: "Category ID is required",
            invalid_type_error: "Category ID must be a string",
        })
        .min(3, "Category ID must be at least 3 characters long"),
    subcategoryId: z
        .string({
            required_error: "Subcategory ID is required",
            invalid_type_error: "Subcategory ID must be a string",
        })
        .min(3, "Subcategory ID must be at least 3 characters long"),
    productTypeId: z
        .string({
            required_error: "Product Type ID is required",
            invalid_type_error: "Product Type ID must be a string",
        })
        .min(3, "Product Type ID must be at least 3 characters"),

    // PRICING
    price: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(z.number().nonnegative("Amount must be non-negative"))
        .nullable(),
    compareAtPrice: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(z.number().nonnegative("Amount must be non-negative"))
        .nullable(),

    // INVENTORY
    quantity: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z
                .number()
                .int()
                .nonnegative("Quantity must be a non-negative number")
        )
        .nullable(),

    // SHIPPING
    weight: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Weight must be a non-negative number")
        )
        .nullable(),
    length: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Length must be a non-negative number")
        )
        .nullable(),
    width: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Width must be a non-negative number")
        )
        .nullable(),
    height: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Height must be a non-negative number")
        )
        .nullable(),
    originCountry: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Origin country must be a string",
            })
            .min(1, "Origin country must be at least 1 characters long")
            .nullable()
    ),
    hsCode: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "HS code must be a string",
            })
            .min(1, "HS code must be at least 1 characters long")
            .nullable()
    ),

    // SEO
    metaTitle: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Meta title must be a string",
            })
            .min(3, "Meta title must be at least 3 characters long")
            .max(70, "Meta title must be at most 70 characters long")
            .nullable()
    ),
    metaDescription: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Meta description must be a string",
            })
            .min(3, "Meta description must be at least 3 characters long")
            .max(160, "Meta description must be at most 160 characters long")
            .nullable()
    ),
    metaKeywords: z.array(
        z
            .string({
                required_error: "Meta keyword is required",
                invalid_type_error: "Meta keyword must be a string",
            })
            .min(1, "Meta keyword must be at least 1 characters long")
    ),

    // OTHER
    createdAt: z
        .union([z.string(), z.date()], {
            required_error: "Created at is required",
            invalid_type_error: "Created at must be a date",
        })
        .transform((v) => new Date(v)),
    updatedAt: z
        .union([z.string(), z.date()], {
            required_error: "Updated at is required",
            invalid_type_error: "Updated at must be a date",
        })
        .transform((v) => new Date(v)),
});

export const productOptionSchema = z.object({
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    productId: z
        .string({
            required_error: "Product ID is required",
            invalid_type_error: "Product ID must be a string",
        })
        .uuid("Product ID is invalid"),
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, "Name must be at least 1 characters long"),
    values: z.array(productOptionValueSchema),
    position: z
        .number({
            required_error: "Position is required",
            invalid_type_error: "Position must be a number",
        })
        .int("Position must be an integer")
        .nonnegative("Position must be a non-negative number"),
    isDeleted: z.boolean({
        required_error: "Deleted status is required",
        invalid_type_error: "Deleted status must be a boolean",
    }),
    deletedAt: z
        .union([z.string(), z.date()], {
            required_error: "Deleted at is required",
            invalid_type_error: "Deleted at must be a date",
        })
        .transform((v) => new Date(v))
        .nullable(),
    createdAt: z
        .union([z.string(), z.date()], {
            required_error: "Created at is required",
            invalid_type_error: "Created at must be a date",
        })
        .transform((v) => new Date(v)),
    updatedAt: z
        .union([z.string(), z.date()], {
            required_error: "Updated at is required",
            invalid_type_error: "Updated at must be a date",
        })
        .transform((v) => new Date(v)),
});

export const productVariantSchema = z.object({
    // BASIC INFO
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    productId: z
        .string({
            required_error: "Product ID is required",
            invalid_type_error: "Product ID must be a string",
        })
        .uuid("Product ID is invalid"),
    combinations: z.record(z.string(), z.string()),

    // PRICING
    price: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(z.number().nonnegative("Amount must be non-negative")),
    compareAtPrice: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(z.number().nonnegative("Amount must be non-negative"))
        .nullable(),

    // INVENTORY
    quantity: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z
                .number()
                .int()
                .nonnegative("Quantity must be a non-negative number")
        ),

    // SHIPPING
    weight: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Weight must be a non-negative number")
        ),
    length: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Length must be a non-negative number")
        ),
    width: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Width must be a non-negative number")
        ),
    height: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .pipe(
            z.number().int().nonnegative("Height must be a non-negative number")
        ),
    originCountry: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Origin country must be a string",
            })
            .min(1, "Origin country must be at least 1 characters long")
            .nullable()
    ),
    hsCode: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "HS code must be a string",
            })
            .min(1, "HS code must be at least 1 characters long")
            .nullable()
    ),
    createdAt: z
        .union([z.string(), z.date()], {
            required_error: "Created at is required",
            invalid_type_error: "Created at must be a date",
        })
        .transform((v) => new Date(v)),
    updatedAt: z
        .union([z.string(), z.date()], {
            required_error: "Updated at is required",
            invalid_type_error: "Updated at must be a date",
        })
        .transform((v) => new Date(v)),
});

export const productWithBrandSchema = productSchema.extend({
    brand: z.object({
        id: z
            .string({
                required_error: "ID is required",
                invalid_type_error: "ID must be a string",
            })
            .uuid("ID is invalid"),
        name: z
            .string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            })
            .min(1, "Name must be at least 1 characters long"),
        slug: z
            .string({
                required_error: "Slug is required",
                invalid_type_error: "Slug must be a string",
            })
            .min(3, "Slug must be at least 3 characters long"),
    }),
    options: z.array(productOptionSchema),
    variants: z.array(productVariantSchema),
    category: z.object({
        id: z
            .string({
                required_error: "ID is required",
                invalid_type_error: "ID must be a string",
            })
            .uuid("ID is invalid"),
        name: z
            .string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            })
            .min(1, "Name must be at least 1 characters long"),
    }),
    subcategory: z.object({
        id: z
            .string({
                required_error: "ID is required",
                invalid_type_error: "ID must be a string",
            })
            .uuid("ID is invalid"),
        name: z
            .string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            })
            .min(1, "Name must be at least 1 characters long"),
        categoryId: z
            .string({
                required_error: "Category ID is required",
                invalid_type_error: "Category ID must be a string",
            })
            .min(3, "Category ID must be at least 3 characters long"),
    }),
    productType: z.object({
        id: z
            .string({
                required_error: "ID is required",
                invalid_type_error: "ID must be a string",
            })
            .uuid("ID is invalid"),
        name: z
            .string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            })
            .min(1, "Name must be at least 1 characters long"),
        categoryId: z
            .string({
                required_error: "Category ID is required",
                invalid_type_error: "Category ID must be a string",
            })
            .min(3, "Category ID must be at least 3 characters long"),
        subcategoryId: z
            .string({
                required_error: "Subcategory ID is required",
                invalid_type_error: "Subcategory ID must be a string",
            })
            .min(3, "Subcategory ID must be at least 3 characters"),
    }),
});

export const createProductSchema = productSchema
    .omit({
        id: true,
        slug: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        options: z.array(productOptionSchema),
        variants: z.array(productVariantSchema),
    });

export type Product = z.infer<typeof productSchema>;
export type ProductOptionValue = z.infer<typeof productOptionValueSchema>;
export type ProductOption = z.infer<typeof productOptionSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductWithBrand = z.infer<typeof productWithBrandSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
