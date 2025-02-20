"use client";

import { DRVGO } from "@/components/globals/svgs";
import { Icons } from "@/components/icons";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SearchInput } from "@/components/ui/search-input";
import { categories, productTypes, subcategories } from "@/config/category";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export function NavbarHome() {
    const [isMenuHidden, setIsMenuHidden] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > previous && latest > 150) setIsMenuHidden(true);
        else setIsMenuHidden(false);
    });

    const { theme, setTheme } = useTheme();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleNavigate = (
        categoryId: string,
        subcategoryId: string,
        productTypeId: string
    ) => {
        if (pathname === "/") {
            return `/?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                categoryId,
                subcategoryId,
                productTypeId,
            })}`;
        }
        return `/?categoryId=${categoryId}&subcategoryId=${subcategoryId}&productTypeId=${productTypeId}`;
    };

    return (
        <motion.header
            variants={{
                visible: {
                    y: 0,
                },
                hidden: {
                    y: "-100%",
                },
            }}
            animate={isMenuHidden ? "hidden" : "visible"}
            transition={{
                duration: 0.35,
                ease: "easeInOut",
            }}
            className="sticky inset-x-0 top-0 z-50 flex h-auto w-full items-center justify-center bg-background"
        >
            <nav className="relative z-10 flex w-full max-w-6xl items-center justify-between gap-10 p-4 md:px-8 xl:max-w-[115rem]">
                <div className="flex items-center gap-20">
                    <Link
                        href="/"
                        title="Home"
                        className="flex items-center gap-2 text-2xl font-bold hover:opacity-100 active:opacity-100"
                    >
                        <DRVGO width={45} height={45} />
                    </Link>

                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            {categories.map((category) => (
                                <NavigationMenuItem key={category.id}>
                                    <NavigationMenuTrigger className="bg-transparent">
                                        {category.name}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent>
                                        <div className="grid w-[800px] grid-cols-3 gap-3 p-4">
                                            {subcategories
                                                .filter(
                                                    (sub) =>
                                                        sub.categoryId ===
                                                        category.id
                                                )
                                                .map((subcategory) => (
                                                    <div
                                                        key={subcategory.id}
                                                        className="space-y-2"
                                                    >
                                                        <h3 className="font-medium text-primary">
                                                            {subcategory.name}
                                                        </h3>

                                                        <ul className="space-y-1">
                                                            {productTypes
                                                                .filter(
                                                                    (pt) =>
                                                                        pt.subcategoryId ===
                                                                        subcategory.id
                                                                )
                                                                .map(
                                                                    (
                                                                        productType
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                productType.id
                                                                            }
                                                                        >
                                                                            <NavigationMenuLink
                                                                                asChild
                                                                            >
                                                                                <Link
                                                                                    href={handleNavigate(
                                                                                        category.id,
                                                                                        subcategory.id,
                                                                                        productType.id
                                                                                    )}
                                                                                    className="block text-sm text-muted-foreground hover:font-semibold hover:text-foreground"
                                                                                >
                                                                                    {
                                                                                        productType.name
                                                                                    }
                                                                                </Link>
                                                                            </NavigationMenuLink>
                                                                        </li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </div>
                                                ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-5">
                    <SearchInput
                        placeholder="Search for products..."
                        classNames={{ wrapper: "min-w-80 hidden xl:flex" }}
                    />

                    <button
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                        title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Icons.Sun className="size-5" />
                        ) : (
                            <Icons.Moon className="size-5" />
                        )}
                        <span className="sr-only">
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                    </button>

                    <Link
                        href="https://github.com/itsdrvgo/next-15-store"
                        title="View on GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icons.Github className="size-5" />
                    </Link>
                </div>
            </nav>
        </motion.header>
    );
}
