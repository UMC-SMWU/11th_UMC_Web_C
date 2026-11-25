import { cn } from "@/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-8 w-8 text-[#17191E] disabled:text-[#D1D5DB]"
        aria-label="이전 페이지"
      >
        ‹
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={cn(
            "h-8 w-8 rounded-md text-[13px] font-bold",
            pageNumber === page ? "bg-[#17191E] text-white" : "text-[#6B7280]",
          )}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-8 w-8 text-[#17191E] disabled:text-[#D1D5DB]"
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
