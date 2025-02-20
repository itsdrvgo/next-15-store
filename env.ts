import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z
            .string()
            .url("DATABASE_URL is required")
            .regex(/postgres/),

        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),
    },
    client: {
        NEXT_PUBLIC_FACEBOOK_APP_ID: z
            .string()
            .min(1, "NEXT_PUBLIC_FACEBOOK_APP_ID is required"),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXT_PUBLIC_FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        NODE_ENV: process.env.NODE_ENV,
    },
});
