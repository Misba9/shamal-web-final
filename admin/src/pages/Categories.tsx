import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { categoriesApi, Category } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Trash2, Loader2 } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await categoriesApi.getAll();
      setCategories(res.data || []);
    } catch (err: any) {
      console.error('fetchCategories error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error('Category name is required');
      return;
    }

    setAdding(true);
    try {
      await categoriesApi.create({ name });
      toast.success('Category created successfully');
      setNewCategoryName('');
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create category';
      toast.error(errorMessage);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoriesApi.delete(deleteTarget._id);
      toast.success('Category deleted successfully');
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete category';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111]">Project Categories</h2>
          <p className="text-[#666]">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="mb-6 rounded-lg border border-[#e5e5e5] bg-white p-4">
        <Label htmlFor="category-name" className="mb-2 block text-sm font-medium text-[#111]">
          Add New Category
        </Label>
        <div className="flex gap-2">
          <Input
            id="category-name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !adding) {
                e.preventDefault();
                handleAddCategory();
              }
            }}
            placeholder="Enter category name"
            className="flex-1"
            disabled={adding}
          />
          <Button
            onClick={handleAddCategory}
            disabled={adding || !newCategoryName.trim()}
            className="inline-flex items-center gap-2"
          >
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          Loading categories...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No categories found. Add your first category above.
        </div>
      ) : (
        <div className="rounded-lg border border-[#e5e5e5] bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f5f5f5] border-b border-[#e5e5e5]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#111]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#111]">Slug</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-[#111]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-[#e5e5e5] last:border-b-0 hover:bg-[#fafafa]">
                  <td className="px-4 py-3 text-sm text-[#111]">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-[#666] font-mono">{category.slug || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-input text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteTarget(category)}
                      title="Delete category"
                    >
                      <Trash2 className="h-3.5 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category &quot;{deleteTarget?.name}&quot;? 
              This action cannot be undone. If this category is linked to any projects, 
              the deletion will be prevented.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
