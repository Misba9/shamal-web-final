import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { jobsApi, Job } from '@/lib/api-client';
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

export const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params: { active?: boolean } = {};
      if (activeFilter === 'active') params.active = true;
      if (activeFilter === 'inactive') params.active = false;

      const res = await jobsApi.getAll(params);
      setJobs(res.data || []);
    } catch (err) {
      console.error('fetchJobs error:', err);
      setError('Failed to load jobs');
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jobsApi.delete(deleteTarget._id);
      toast.success('Job deactivated successfully');
      setDeleteTarget(null);
      await fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to deactivate job');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111]">Jobs</h2>
          <p className="text-[#666]">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => navigate('/jobs/new')} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add job
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
      </div>

      {loading ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          Loading jobs...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No jobs found. Create one to get started.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Job</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#111]">{job.title}</p>
                          {job.experience && (
                            <p className="text-xs text-[#999]">{job.experience}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666]">{job.department || '—'}</td>
                      <td className="px-4 py-3 text-sm text-[#666]">{job.location || '—'}</td>
                      <td className="px-4 py-3 text-sm text-[#666]">{job.employmentType}</td>
                      <td className="px-4 py-3">
                        <StatusBadge isActive={job.isActive} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => navigate(`/jobs/${job._id}/edit`)}
                          >
                            <Pencil className="h-3.5 w-3" />
                          </Button>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-input text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(job)}
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
            <AlertDialogTitle>Deactivate job</AlertDialogTitle>
            <AlertDialogDescription>
              Deactivate &quot;{deleteTarget?.title}&quot;? This will hide it from the public site. You can reactivate it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
