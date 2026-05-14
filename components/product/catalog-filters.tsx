"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Check, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { StoreCategory } from "@/lib/types"

const PAGE_PARAM = "page"
const QUERY_PARAM = "q"
const CATEGORY_PARAM = "categoria"
const AVAILABLE_PARAM = "disponibles"

type CatalogFiltersProps = {
  categories: StoreCategory[]
  initialQuery: string
  initialCategory: string
  initialOnlyAvailable: boolean
}

function useCatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const setParams = (payload: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())

    for (const [key, value] of Object.entries(payload)) {
      if (!value || value === "all") {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    }

    next.delete(PAGE_PARAM)
    router.replace(`${pathname}?${next.toString()}`)
  }

  return { setParams }
}

export function CatalogFilters({ categories, initialQuery, initialCategory, initialOnlyAvailable }: CatalogFiltersProps) {
  const isMobile = useIsMobile()
  const { setParams } = useCatalogFilters()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory || "all")
  const [onlyAvailable, setOnlyAvailable] = useState(initialOnlyAvailable)

  const items = useMemo(() => [{ id: "all", nombre: "Todas" }, ...categories], [categories])

  const applyFilters = () => {
    setParams({
      [QUERY_PARAM]: query || null,
      [CATEGORY_PARAM]: category,
      [AVAILABLE_PARAM]: onlyAvailable ? "1" : null
    })
  }

  const filterPanel = (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold">Buscar prenda</p>
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej: vestido negro" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Categoria</p>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona categoria" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id ?? item.nombre} value={item.id === "all" ? "all" : item.nombre}>
                {item.id === "all" ? "Todas" : item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Comando rapido</p>
        <Command className="rounded-lg border border-[var(--color-gold-muted)]/40">
          <CommandInput placeholder="Filtrar por categoria" />
          <CommandList>
            <CommandEmpty>Sin categorias</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const value = item.id === "all" ? "all" : item.nombre
                const selected = category === value
                return (
                  <CommandItem key={value} onSelect={() => setCategory(value)}>
                    {selected ? <Check className="mr-2 size-4 text-[var(--color-gold)]" /> : null}
                    {item.id === "all" ? "Todas" : item.nombre}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <SlidersHorizontal className="mr-2 size-4" />
            Opciones visuales
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Preferencias</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={onlyAvailable} onCheckedChange={(value) => setOnlyAvailable(Boolean(value))}>
            Mostrar solo disponibles
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button className="w-full" onClick={applyFilters}>
        Aplicar filtros
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="size-4" />
            Filtrar catalogo
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>Ajusta el feed de productos para encontrar tu look ideal.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-3">{filterPanel}</div>
          <DrawerFooter>
            <Button
              variant="outline"
              onClick={() => setParams({ [QUERY_PARAM]: null, [CATEGORY_PARAM]: null, [AVAILABLE_PARAM]: null })}
            >
              Limpiar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="size-4" />
          Filtros avanzados
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Refina tu busqueda</SheetTitle>
          <SheetDescription>Ordena el catalogo para descubrir prendas que combinen con tu estilo.</SheetDescription>
        </SheetHeader>
        <div className="py-6">{filterPanel}</div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => setParams({ [QUERY_PARAM]: null, [CATEGORY_PARAM]: null, [AVAILABLE_PARAM]: null })}
          >
            Limpiar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
