import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { newsletterApi, NewsletterSubscriber } from '@/lib/api-client';
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
import { Download, Loader2, Trash2 } from 'lucide-react';

export const NewsletterPage = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await newsletterApi.getAll();
      setSubscribers(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await newsletterApi.exportCsv();
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await newsletterApi.delete(deleteTarget._id);
      setSubscribers((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success('Subscriber removed');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111]">Newsletter</h2>
          <p className="text-[#666]">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exporting || subscribers.length === 0}
          className="inline-flex gap-2"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export to CSV
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#666]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No subscribers yet. They will appear when users subscribe via the website.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#e5e5e5] bg-white">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                <th className="px-4 py-3 font-medium text-[#111]">Email</th>
                <th className="px-4 py-3 font-medium text-[#111]">Subscribed</th>
                <th className="px-4 py-3 font-medium text-[#111] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-b border-[#e5e5e5] hover:bg-[#fafafa]">
                  <td className="px-4 py-3">
                    <a href={`mailto:${s.email}`} className="text-blue-600 hover:underline">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[#999]">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setDeleteTarget(s)}
                    >
                      <Trash2 className="h-3.5 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Remove {deleteTarget?.email} from the newsletter list? They can subscribe again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
