ALTER TABLE "product_options" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "image_url";