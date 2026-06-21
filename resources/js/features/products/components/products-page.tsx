import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

import {
  DataTableFooter,
  DataTableLayout,
  DataTableToolbar,
  DataTableViewOptions,
  createDataTableActionsColumn,
  createDataTableSelectionColumn,
  DataTableRowActionsMenu,
} from '@/components/shared/data-table';
import { PageTitle } from '@/components/shared/page-title';
import { TableDropdownAction } from '@/components/shared/table-dropdown-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteProductDialog } from '@/features/products/components/delete-product-dialog';
import { ProductDetailDialog } from '@/features/products/components/product-detail-dialog';
import type { Product } from '@/features/products/schemas/product.schema';
import {
  formatProductDate,
  formatProductMoney,
  getProductSalePrice,
} from '@/features/products/utils/product-display.utils';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Product>();

function TruncatedCell({
  value,
  className,
  maxWidth = 'max-w-[200px]',
}: {
  value: string | null | undefined;
  className?: string;
  maxWidth?: string;
}) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <p className={`truncate text-sm ${maxWidth} ${className ?? ''}`} title={value}>
      {value}
    </p>
  );
}

type ProductsPageProps = {
  products: LaravelPaginator<Product>;
};

export function ProductsPage({ products }: ProductsPageProps) {
  const { hasAbility } = useAuth();
  const canManage = hasAbility('products.manage');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(products, ['products']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const openView = React.useCallback((product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  }, []);

  const openDelete = React.useCallback((product: Product) => {
    setSelectedForDelete(product);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<Product>(),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm tabular-nums">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Product',
        cell: ({ row }) => (
          <button
            type="button"
            className="flex min-w-[200px] items-center gap-3 text-left hover:opacity-80"
            onClick={() => openView(row.original)}
          >
            {row.original.image_url ? (
              <img
                src={row.original.image_url}
                alt=""
                className="h-10 w-10 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">{row.original.name}</p>
            </div>
          </button>
        ),
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue() ?? '—'}</span>
        ),
      }),
      columnHelper.accessor('short_description', {
        header: 'Short Description',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} />,
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} maxWidth="max-w-[240px]" />,
      }),
      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue() ?? '—'}</span>
        ),
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums">{formatProductMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('discount_type', {
        header: 'Discount Type',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.display({
        id: 'sale_price',
        header: 'Sale Price',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatProductMoney(getProductSalePrice(row.original))}
          </span>
        ),
      }),
      columnHelper.accessor('stock_quantity', {
        header: 'Stock',
        cell: ({ getValue }) => {
          const stock = getValue();
          if (stock == null) return '—';
          return (
            <span
              className={
                stock === 0
                  ? 'font-medium text-destructive'
                  : stock <= 10
                    ? 'font-medium text-amber-600 dark:text-amber-400'
                    : 'tabular-nums'
              }
            >
              {stock}
            </span>
          );
        },
      }),
      columnHelper.accessor('image', {
        header: 'Image Path',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} maxWidth="max-w-[160px]" />,
      }),
      columnHelper.accessor('images', {
        header: 'Gallery',
        cell: ({ getValue }) => {
          const images = getValue();
          if (!images?.length) return '—';
          return (
            <span className="text-sm tabular-nums">
              {images.length} image{images.length === 1 ? '' : 's'}
            </span>
          );
        },
      }),
      columnHelper.accessor('nfc_type', {
        header: 'NFC Type',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('weight', {
        header: 'Weight',
        cell: ({ getValue }) => {
          const weight = getValue();
          if (weight == null) return '—';
          return <span className="tabular-nums">{Number(weight)}</span>;
        },
      }),
      columnHelper.accessor('is_featured', {
        header: 'Featured',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Yes' : 'No'}
          </Badge>
        ),
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      columnHelper.accessor('meta_title', {
        header: 'Meta Title',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} />,
      }),
      columnHelper.accessor('meta_description', {
        header: 'Meta Description',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} maxWidth="max-w-[240px]" />,
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatProductDate(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatProductDate(getValue())}
          </span>
        ),
      }),
      createDataTableActionsColumn<Product>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.name}`}>
            <TableDropdownAction
              icon={Eye}
              onClick={() => openView(row.original)}
            >
              View
            </TableDropdownAction>
            {canManage ? (
              <>
                <TableDropdownAction
                  icon={Pencil}
                  onClick={() => router.visit(`/products/${row.original.id}/edit`)}
                >
                  Edit
                </TableDropdownAction>
                <TableDropdownAction
                  icon={Trash2}
                  className="text-destructive focus:text-destructive"
                  onClick={() => openDelete(row.original)}
                >
                  Delete
                </TableDropdownAction>
              </>
            ) : null}
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [canManage, openDelete, openView],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { globalFilter, rowSelection, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      columnVisibility: {
        slug: false,
        description: false,
        sku: false,
        image: false,
        images: false,
        meta_title: false,
        meta_description: false,
        created_at: false,
        updated_at: false,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageTitle title="Products" description="NFC card products" icon={Package} />
        <Button type="button" onClick={() => router.visit('/products/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <DataTableLayout
        table={table}
        colSpan={table.getAllColumns().length}
        bodyProps={{ emptyMessage: 'No products found.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search products..."
                className="h-9 w-full max-w-xs"
              />
            }
            end={
              <DataTableViewOptions
                table={table}
                showExport={false}
                onRefresh={reload}
                isRefreshing={isFetching}
                columnLabelFormatter={(columnId) => {
                  const labels: Record<string, string> = {
                    id: 'ID',
                    name: 'Product',
                    slug: 'Slug',
                    short_description: 'Short Description',
                    description: 'Description',
                    sku: 'SKU',
                    price: 'Price',
                    discount_type: 'Discount Type',
                    sale_price: 'Sale Price',
                    stock_quantity: 'Stock',
                    image: 'Image Path',
                    images: 'Gallery',
                    nfc_type: 'NFC Type',
                    weight: 'Weight',
                    is_featured: 'Featured',
                    is_active: 'Status',
                    meta_title: 'Meta Title',
                    meta_description: 'Meta Description',
                    created_at: 'Created',
                    updated_at: 'Updated',
                  };
                  return labels[columnId] ?? columnId.replaceAll('_', ' ');
                }}
              />
            }
          />
        }
        footer={<DataTableFooter table={table} />}
      />
      <ProductDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        product={selectedProduct}
        canManage={canManage}
        onDelete={canManage ? openDelete : undefined}
      />
      {canManage ? (
        <DeleteProductDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          product={selectedForDelete}
          isDeleting={isDeleting}
          onConfirm={async () => {
            if (!selectedForDelete) return;
            setIsDeleting(true);
            router.delete(`/products/${selectedForDelete.id}`, {
              onSuccess: () => {
                showMutationSuccess('Product deleted');
                setDeleteOpen(false);
                setSelectedForDelete(null);
              },
              onError: () => showMutationError(null, 'Failed to delete product'),
              onFinish: () => setIsDeleting(false),
            });
          }}
        />
      ) : null}
    </div>
  );
}
