import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TableFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export function TableFooter({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalCount,
}: TableFooterProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <p className="text-sm text-gray-600">
        Showing {startIndex + 1}-{endIndex} of {totalCount} songs
      </p>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              const distance = Math.abs(page - currentPage);
              return distance === 0 || distance === 1 || page === 1 || page === totalPages;
            })
            .map((page, index, array) => {
              if (index > 0 && array[index - 1] !== page - 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <PaginationItem>
                      <PaginationLink className="cursor-default">...</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${currentPage === page ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-gray-100"}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                );
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer ${currentPage === page ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-gray-100"}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}