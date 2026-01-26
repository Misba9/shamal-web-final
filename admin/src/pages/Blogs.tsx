import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { blogsApi, Blog, BlogStatus } from '@/lib/api-client';
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

const STATUS_OPTIONS: { value: '' | BlogStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    published: 'bg-green-100 text-green-800',
  };
  return (
    <span className={cn('inline-flex rounded px-2 py-0.5 text-xs font-medium', styles[status] || 'bg-gray-100 text-gray-700')}>
      {status === 'draft' ? 'Draft' : 'Published'}
    </span>
  );
}

export const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | BlogStatus>('');
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogsApi.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setBlogs(res.data);
      setTotal(res.pagination?.total ?? res.data.length);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load blogs');
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, search, statusFilter]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await blogsApi.delete(deleteTarget._id);
      toast.success('Blog deleted successfully');
      setDeleteTarget(null);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      const newStatus: BlogStatus = blog.status === 'published' ? 'draft' : 'published';
      await blogsApi.update(blog._id, { status: newStatus });
      toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update blog status');
    }
  };

  const img = (b: Blog) => b.featuredImage || b.thumbnail;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111]">Blogs</h2>
          <p className="text-[#666]">{total} post{total !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => navigate('/blogs/new')} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add blog
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 gap-2 min-w-[200px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search title, slug, content..."
            className="h-10 flex-1 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
          />
          <Button variant="outline" onClick={handleSearch}>Search</Button>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as '' | BlogStatus); setPage(1); }}
          className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || 'all'} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">Loading blogs...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No blogs found. Create one to get started.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Post</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Published</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {blogs.map((b) => (
                    <tr key={b._id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {img(b) && (
                            <img src={getImageSrc(img(b)!)} alt="" className="h-10 w-10 flex-shrink-0 rounded object-cover" />
                          )}
                          <div>
                            <p className="font-medium text-[#111]">{b.title}</p>
                            <p className="text-xs text-[#666]">{b.slug}</p>
                            {b.content && (
                              <p className="max-w-[240px] truncate text-xs text-[#999] sm:max-w-[320px]">
                                {b.content.replace(/<[^>]+>/g, '').slice(0, 80)}…
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 text-sm text-[#666]">
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="outline" 
                            className="h-8 px-2" 
                            onClick={() => handleTogglePublish(b)}
                            title={b.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {b.status === 'published' ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button variant="outline" className="h-8 px-2" onClick={() => navigate(`/blogs/${b._id}/edit`)}>
                            <Pencil className="h-3.5 w-3" />
                          </Button>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-input text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(b)}
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

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[#666]">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="h-8" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </Button>
                <Button variant="outline" className="h-8" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{deleteTarget?.title}&quot;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
