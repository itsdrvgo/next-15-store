import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getAbsoluteURL(path: string = "/") {
    if (process.env.NEXT_PUBLIC_DEPLOYMENT_URL)
        return `https://${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`;
    else if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}${path}`;
    return "http://localhost:3000" + path;
}

export function handleClientError(error: unknown, toastId?: string | number) {
    if (
        Object.prototype.hasOwnProperty.call(error, "error") &&
        Object.prototype.hasOwnProperty.call(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).error,
            "description"
        )
    )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return toast.error((error as any).error.description, { id: toastId });
    else if (error instanceof Error)
        return toast.error(error.message, { id: toastId });
    else
        toast.error("An error occurred. Please try again later.", {
            id: toastId,
        });
}

export function convertEmptyStringToNull(data: unknown) {
    return typeof data === "string" && data === "" ? null : data;
}

export function convertDollarToCent(dollar: number) {
    return Math.round(dollar * 100);
}

export function convertCentToDollar(cent: number) {
    return +(cent / 100).toFixed(2);
}

export function formatPriceTag(price: number, keepDeciamls = false) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: keepDeciamls ? 2 : 0,
    }).format(price);
}

export function slugify(text: string, separator: string = "-") {
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, separator);
}

export function generateProductSlug(productName: string, brandName: string) {
    return slugify(
        `${brandName} ${productName} ${Date.now()} ${Math.random().toString(36).substring(7)}`
    );
}
