"use client"

import { useMemo, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminSessionActions } from "@/components/sections/admin-session-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AVAILABLE_SIZES } from "@/lib/constants"
import type { StoreCategory, StoreProduct } from "@/lib/types"
import { productSchema, type ProductInput } from "@/lib/validations/product"
import { formatPrice } from "@/lib/utils"

const defaultValues: ProductInput = {
  nombre: "",
  slug: "",
  descripcion: "",
  precio: 0,
  categoria: "",
  categoryId: null,
  imagenes: [],
  tallas: ["S"],
  disponible: true,
  visible: true,
  destacado: false
}

type AdminProductManagerProps = {
  initialProducts: StoreProduct[]
  categories: StoreCategory[]
}

async function filesToBase64(files: FileList): Promise<string[]> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result ?? ""))
          reader.onerror = () => reject(new Error("No se pudo leer la imagen"))
          reader.readAsDataURL(file)
        })
    )
  )
}

export function AdminProductManager({ initialProducts, categories }: AdminProductManagerProps) {
  const [products, setProducts] = useState(initialProducts)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues
  })

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingProductId) ?? null,
    [products, editingProductId]
  )

  const openForCreate = () => {
    form.reset(defaultValues)
    setEditingProductId(null)
    setIsOpen(true)
  }

  const openForEdit = (product: StoreProduct) => {
    form.reset({
      nombre: product.nombre,
      slug: product.slug,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      categoryId: null,
      imagenes: product.imagenes,
      tallas: product.tallas,
      disponible: product.disponible,
      visible: product.visible,
      destacado: product.destacado
    })
    setEditingProductId(product.id)
    setIsOpen(true)
  }

  const refreshProducts = async () => {
    const response = await fetch("/api/admin/products", { cache: "no-store" })
    if (response.ok) {
      const payload = (await response.json()) as { products: StoreProduct[] }
      setProducts(payload.products)
    }
  }

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const endpoint = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products"
      const method = editingProduct ? "PATCH" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        toast({
          title: "No se pudo guardar",
          description: "Revisa el formulario e intenta nuevamente.",
          variant: "destructive"
        })
        return
      }

      await refreshProducts()
      toast({
        title: editingProduct ? "Producto actualizado" : "Producto creado",
        description: "Los cambios ya estan visibles en el catalogo."
      })
      setIsOpen(false)
    })
  })

  const deleteProduct = async (id: string) => {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (!response.ok) {
      toast({ title: "No se pudo eliminar", variant: "destructive" })
      return
    }
    await refreshProducts()
    toast({ title: "Producto eliminado" })
  }

  const toggleField = async (id: string, field: "visible" | "disponible", value: boolean) => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value })
    })

    if (response.ok) {
      await refreshProducts()
      toast({ title: `Producto ${field === "visible" ? "actualizado" : "disponibilidad actualizada"}` })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-white">Panel admin</h1>
        <div className="flex items-center gap-2">
          <AdminSessionActions />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openForCreate}>
                <Plus className="size-4" />
                Nuevo producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar producto" : "Agregar producto"}</DialogTitle>
              <DialogDescription>Gestiona prendas visibles del catalogo social-commerce.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form className="space-y-4" onSubmit={onSubmit}>
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Vestido Noche Rebel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="precio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio (CLP)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.nombre}>
                                {category.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripcion</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe estilo, fit y detalles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imagenes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subir imagenes</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (event) => {
                            const files = event.target.files
                            if (!files?.length) return
                            const base64 = await filesToBase64(files)
                            field.onChange(base64)
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-neutral-400">{field.value.length} imagen(es) listas para guardar</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tallas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tallas</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2">
                          {AVAILABLE_SIZES.map((size) => {
                            const selected = field.value.includes(size)
                            return (
                              <Button
                                key={size}
                                type="button"
                                variant={selected ? "default" : "outline"}
                                onClick={() => {
                                  if (selected) {
                                    field.onChange(field.value.filter((item) => item !== size))
                                  } else {
                                    field.onChange([...field.value, size])
                                  }
                                }}
                              >
                                {size}
                              </Button>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant={form.watch("disponible") ? "default" : "outline"}
                    onClick={() => form.setValue("disponible", !form.watch("disponible"))}
                  >
                    Disponible
                  </Button>
                  <Button
                    type="button"
                    variant={form.watch("visible") ? "default" : "outline"}
                    onClick={() => form.setValue("visible", !form.watch("visible"))}
                  >
                    Visible
                  </Button>
                  <Button
                    type="button"
                    variant={form.watch("destacado") ? "default" : "outline"}
                    onClick={() => form.setValue("destacado", !form.watch("destacado"))}
                  >
                    Destacado
                  </Button>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    {editingProduct ? "Guardar cambios" : "Crear producto"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-gold-muted)]/40 bg-black/70 p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-white">{product.nombre}</p>
                    <p className="text-xs text-neutral-400">/{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell>{formatPrice(product.precio)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant={product.visible ? "default" : "outline"} onClick={() => toggleField(product.id, "visible", !product.visible)}>
                      {product.visible ? "Visible" : "Oculto"}
                    </Button>
                    <Button size="sm" variant={product.disponible ? "default" : "outline"} onClick={() => toggleField(product.id, "disponible", !product.disponible)}>
                      {product.disponible ? "Disponible" : "Agotado"}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="outline" onClick={() => openForEdit(product)}>
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta accion elimina la prenda del catalogo y no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
