import { relations, sql } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { ProductOptionValue } from "../validations";
import { timestamps } from "./helper";

export const products = pgTable(
    "products",
    {
        // BASIC INFO
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        title: text("title").notNull(),
        slug: text("slug").notNull().unique(),
        description: text("description"),
        brandId: uuid("brand_id").notNull(),
        isAvailable: boolean("is_available").default(true).notNull(),
        imageUrls: jsonb("image_urls").default([]).notNull(),
        productHasVariants: boolean("product_has_variants")
            .default(false)
            .notNull(),

        // CATEGORY
        categoryId: text("category_id").notNull(),
        subcategoryId: text("subcategory_id").notNull(),
        productTypeId: text("product_type_id").notNull(),

        // PRICING
        price: integer("price"),
        compareAtPrice: integer("compare_at_price"),

        // INVENTORY
        quantity: integer("quantity"),

        // SHIPPING
        weight: integer("weight"),
        length: integer("length"),
        width: integer("width"),
        height: integer("height"),
        originCountry: text("origin_country"),
        hsCode: text("hs_code"),

        // SEO
        metaTitle: text("meta_title"),
        metaDescription: text("meta_description"),
        metaKeywords: text("meta_keywords").array().default([]),

        // OTHER
        ...timestamps,
    },
    (table) => ({
        productFtsIdx: index("product_fts_idx").using(
            "gin",
            sql`(
            setweight(to_tsvector('english', ${table.title}), 'A') ||
            setweight(to_tsvector('english', ${table.description}), 'B')
        )`
        ),
    })
);

export const productOptions = pgTable(
    "product_options",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        values: jsonb("values")
            .$type<ProductOptionValue[]>()
            .default([])
            .notNull(),
        position: integer("position").default(0).notNull(),
        isDeleted: boolean("is_deleted").default(false).notNull(),
        deletedAt: timestamp("deleted_at"),
        ...timestamps,
    },
    (table) => ({
        productOptionProductIdIdx: index("product_option_product_id_idx").on(
            table.productId
        ),
    })
);

export const productVariants = pgTable(
    "product_variants",
    {
        // BASIC INFO
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        combinations: jsonb("combinations").default({}).notNull(),

        // PRICING
        price: integer("price").notNull(),
        compareAtPrice: integer("compare_at_price"),

        // INVENTORY
        quantity: integer("quantity").notNull().default(0),

        // SHIPPING
        weight: integer("weight").notNull().default(0),
        length: integer("length").notNull().default(0),
        width: integer("width").notNull().default(0),
        height: integer("height").notNull().default(0),
        originCountry: text("origin_country"),
        hsCode: text("hs_code"),
        ...timestamps,
    },
    (table) => ({
        productVariantProductIdIdx: index("product_variant_product_id_idx").on(
            table.productId
        ),
    })
);

export const productsRelations = relations(products, ({ many }) => ({
    options: many(productOptions),
    variants: many(productVariants),
}));

export const productOptionsRelations = relations(productOptions, ({ one }) => ({
    product: one(products, {
        fields: [productOptions.productId],
        references: [products.id],
    }),
}));

export const productVariantsRelations = relations(
    productVariants,
    ({ one }) => ({
        product: one(products, {
            fields: [productVariants.productId],
            references: [products.id],
        }),
    })
);
