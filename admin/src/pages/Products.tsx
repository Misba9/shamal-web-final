import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { productsApi, Product } from '@/lib/api-client';
import { getImageSrc } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-2 py-0.5 text-xs font-medium',
        isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function HomeBadge({ showOnHome }: { showOnHome: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-2 py-0.5 text-xs font-medium',
        showOnHome ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
      )}
    >
      {showOnHome ? 'Yes' : 'No'}
    </span>
  );
}

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [homeFilter, setHomeFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params: { active?: boolean; home?: boolean } = {};
      if (activeFilter === 'active') params.active = true;
      if (activeFilter === 'inactive') params.active = false;
      if (homeFilter === 'yes') params.home = true;
      if (homeFilter === 'no') params.home = false;

      const res = await productsApi.getAll(params);
      setProducts(res.data || []);
    } catch (err) {
      console.error('fetchProducts error:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, homeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productsApi.delete(deleteTarget._id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111]">Products</h2>
          <p className="text-[#666]">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => navigate('/products/new')} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
        <select
          value={homeFilter}
          onChange={(e) => setHomeFilter(e.target.value as 'all' | 'yes' | 'no')}
          className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
        >
          <option value="all">All products</option>
          <option value="yes">Show on home</option>
          <option value="no">Hide from home</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          Loading products...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No products found. Create one to get started.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Show on Home</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Order</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image && (
                            <img
                              src={getImageSrc(p.image)}
                              alt=""
                              className="h-10 w-10 flex-shrink-0 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-[#111]">{p.name}</p>
                            {p.shortDescription && (
                              <p className="max-w-[240px] truncate text-xs text-[#999] sm:max-w-[320px]">
                                {p.shortDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge isActive={p.isActive} />
                      </td>
                      <td className="px-4 py-3">
                        <HomeBadge showOnHome={p.showOnHome} />
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666]">{p.order ?? 0}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => navigate(`/products/${p._id}/edit`)}
                          >
                            <Pencil className="h-3.5 w-3" />
                          </Button>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-input text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 className="h-3.5 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{deleteTarget?.name}&quot;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
