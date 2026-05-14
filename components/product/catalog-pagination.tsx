import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type CatalogPaginationProps = {
  total: number
  page: number
  pageSize: number
  baseQuery: string
}

export function CatalogPagination({ total, page, pageSize, baseQuery }: CatalogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) return null

  const createUrl = (targetPage: number) => {
    const params = new URLSearchParams(baseQuery)
    params.set("page", String(targetPage))
    return `/catalogo?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2)
  )

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={createUrl(Math.max(1, page - 1))} />
        </PaginationItem>
        {pages.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink href={createUrl(number)} isActive={number === page}>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={createUrl(Math.min(totalPages, page + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}