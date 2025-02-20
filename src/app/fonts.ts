import { DM_Sans, Rubik } from "next/font/google";

export const dmsans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "800"],
    display: "swap",
    variable: "--font-dmsans",
});

export const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-rubik",
});
