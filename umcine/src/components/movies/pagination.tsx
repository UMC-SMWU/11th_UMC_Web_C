import { cn } from "../../utils/cn";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const MAX_PAGE = 500;
const GROUP_SIZE = 5;

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const lastPage = Math.min(totalPages, MAX_PAGE);
    const start = Math.floor((currentPage - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
    const end = Math.min(start + GROUP_SIZE - 1, lastPage);

    const pageNumbers = Array.from(
        { length: end - start + 1 },
        (_, index) => start + index,
    );

    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <button
                className="rounded px-3 py-2 disabled:cursor-not-allowed disabled:text-gray-300"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                이전
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={cn(
                        "h-9 w-9 rounded-lg",
                        page === currentPage
                            ? "bg-black text-white"
                            : "bg-transparent text-black",
                    )}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className="rounded px-3 py-2 disabled:cursor-not-allowed disabled:text-gray-300"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
            >
                다음
            </button>
        </div>
    );
}