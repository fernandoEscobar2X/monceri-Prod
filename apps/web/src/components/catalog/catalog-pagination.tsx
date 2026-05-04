import Link from "next/link";

type CatalogPaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function hrefForPage(searchParams: Record<string, string | undefined>, page: number) {
  const next = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") {
      next.set(key, value);
    }
  }

  next.set("page", String(page));
  return `/catalogo?${next.toString()}`;
}

export function CatalogPagination({ page, searchParams, totalPages }: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_value, index) => index + 1);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link className="px-3 py-2 text-sm font-semibold text-[#111827]" href={hrefForPage(searchParams, page - 1)}>
          Anterior
        </Link>
      ) : null}
      {pages.map((currentPage) => (
        <Link
          key={currentPage}
          className={`inline-flex size-10 items-center justify-center rounded-xl text-sm font-bold ${
            currentPage === page ? "bg-[#111827] text-white" : "text-[#111827] hover:bg-gray-100"
          }`}
          href={hrefForPage(searchParams, currentPage)}
        >
          {currentPage}
        </Link>
      ))}
      {page < totalPages ? (
        <Link className="px-3 py-2 text-sm font-semibold text-[#111827]" href={hrefForPage(searchParams, page + 1)}>
          Siguiente
        </Link>
      ) : null}
    </nav>
  );
}
