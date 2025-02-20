import { db } from "@/lib/db";
import { productQueries } from "@/lib/db/queries";
import * as schema from "@/lib/db/schema";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

type ContextProps = {
    req: NextRequest | Request;
};

export const createContextInner = ({ req }: ContextProps) => {
    return {
        db,
        req,
        schemas: schema,
        queries: {
            products: productQueries,
        },
    };
};

export const createContext = async ({
    req,
}: FetchCreateContextFnOptions & {
    req: NextRequest | Request;
}) =>
    createContextInner({
        req,
    });

export type Context = ReturnType<typeof createContextInner>;
