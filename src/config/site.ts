import { getAbsoluteURL } from "@/lib/utils";

export const siteConfig: SiteConfig = {
    name: "Next.JS 15 Store",
    description: "A Store built with Next.JS 15",
    longDescription:
        "A Store built with Next.JS 15, TailwindCSS, Postgres, Drizzle, Redis, Drizzle and more.",
    keywords: [
        "Next.JS",
        "TailwindCSS",
        "Postgres",
        "Drizzle",
        "Redis",
        "Vercel",
        "DRVGO",
        "itsdrvgo",
        "Drago",
        "DragoLuca",
        "Store",
        "Marketplace",
        "E-Commerce",
    ],
    category: "Marketplace",
    developer: {
        name: "DRVGO",
        url: "https://itsdrvgo.me/",
    },
    og: {
        url: getAbsoluteURL("/og.webp"),
        width: 1200,
        height: 630,
    },
    links: {
        Twitter: "https://x.com/itsdrvgo",
        Instagram: "https://www.instagram.com/itsdrvgo",
        Github: "https://github.com/itsdrvgo",
        Youtube: "https://youtube.com/@itsdrvgodev",
    },
};
