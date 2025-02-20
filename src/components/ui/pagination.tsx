import { parseAsInteger, useQueryState } from "nuqs";
import { Icons } from "../icons";
import { Button } from "./button";

export function Pagination({
    totalPages,
    totalItems,
}: {
    totalPages: number;
    totalItems: number;
}) {
    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <Button
                variant="ghost"
                size="icon"
                disabled={Math.abs(page) <= 1}
                onClick={() => setPage(Math.abs(page) - 1)}
            >
                <Icons.ChevronLeft className="size-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
                {totalItems.toLocaleString()} results (page {Math.abs(page)} of{" "}
                {totalPages})
            </span>

            <Button
                variant="ghost"
                size="icon"
                disabled={Math.abs(page) >= totalPages}
                onClick={() => setPage(Math.abs(page) + 1)}
            >
                <Icons.ChevronRight className="size-4" />
            </Button>
        </div>
    );
}
