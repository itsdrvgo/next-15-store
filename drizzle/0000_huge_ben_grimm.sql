CREATE TABLE "product_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"values" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_options_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"image_url" text,
	"combinations" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"price" integer NOT NULL,
	"compare_at_price" integer,
	"quantity" integer DEFAULT 0 NOT NULL,
	"weight" integer DEFAULT 0 NOT NULL,
	"length" integer DEFAULT 0 NOT NULL,
	"width" integer DEFAULT 0 NOT NULL,
	"height" integer DEFAULT 0 NOT NULL,
	"origin_country" text,
	"hs_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"brand_id" uuid NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"image_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"product_has_variants" boolean DEFAULT false NOT NULL,
	"category_id" text NOT NULL,
	"subcategory_id" text NOT NULL,
	"product_type_id" text NOT NULL,
	"price" integer,
	"compare_at_price" integer,
	"quantity" integer,
	"weight" integer,
	"length" integer,
	"width" integer,
	"height" integer,
	"origin_country" text,
	"hs_code" text,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_id_unique" UNIQUE("id"),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_option_product_id_idx" ON "product_options" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variant_product_id_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_fts_idx" ON "products" USING gin ((
            setweight(to_tsvector('english', "title"), 'A') ||
            setweight(to_tsvector('english', "description"), 'B')
        ));