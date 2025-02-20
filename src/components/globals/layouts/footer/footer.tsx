import { Vercel } from "@/components/globals/svgs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export function Footer({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <>
            <footer
                className={cn("flex justify-center p-5", className)}
                {...props}
            >
                <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-2 md:flex-row md:justify-between xl:max-w-[115rem]">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()}{" "}
                        <Link
                            type="link"
                            href="https://itsdrvgo.me"
                            className="underline"
                        >
                            DRVGO
                        </Link>
                        . All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                        <p>Powered by</p>
                        <Vercel width={70.75} height={16} />
                    </div>
                </div>
            </footer>
        </>
    );
}
