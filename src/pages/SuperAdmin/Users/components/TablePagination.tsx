interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
}

export function TablePagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems 
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Sayfa {currentPage} / {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Önceki
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
      {totalItems !== undefined && (
        <div className="text-sm text-gray-500">
          Toplam: {totalItems} kayıt
        </div>
      )}
    </div>
  );
}