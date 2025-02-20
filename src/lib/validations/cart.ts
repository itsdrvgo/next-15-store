import { z } from "zod";
import { convertEmptyStringToNull } from "../utils";

export const cartSchema = z.object({
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
    variantId: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Variant ID must be a string",
            })
            .uuid("Variant ID is invalid")
            .nullable()
    ),
    quantity: z
        .number({
            required_error: "Quantity is required",
            invalid_type_error: "Quantity must be a number",
        })
        .int("Quantity must be an integer")
        .positive("Quantity must be positive"),
    status: z.boolean({
        required_error: "Status is required",
        invalid_type_error: "Status must be a boolean",
    }),
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

export const createCartSchema = cartSchema.pick({
    productId: true,
    variantId: true,
    quantity: true,
});

export type Cart = z.infer<typeof cartSchema>;
export type CreateCart = z.infer<typeof createCartSchema>;
