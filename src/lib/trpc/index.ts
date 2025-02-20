import { productsRouter } from "./routes";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    products: productsRouter,
});

export type AppRouter = typeof appRouter;
