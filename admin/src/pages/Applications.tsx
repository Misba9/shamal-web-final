import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { applicationsApi, jobsApi, JobApplication, Job, ApplicationStatus } from '@/lib/api-client';
import { getImageSrc } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    New: 'bg-blue-100 text-blue-800',
    Reviewed: 'bg-yellow-100 text-yellow-800',
    Shortlisted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={cn('inline-flex rounded px-2 py-0.5 text-xs font-medium', styles[status] || 'bg-gray-100 text-gray-700')}>
      {status}
    </span>
  );
}

export const ApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const fetchJobs = useCallback(async () => {
    try {
      const res = await jobsApi.getAll();
      setJobs(res.data || []);
    } catch (err) {
      console.error('fetchJobs error:', err);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      let res;
      if (jobFilter === 'all') {
        res = await applicationsApi.getAll();
      } else {
        res = await applicationsApi.getByJob(jobFilter);
      }
      let data = res.data || [];
      if (statusFilter !== 'all') {
        data = data.filter((app) => app.status === statusFilter);
      }
      setApplications(data);
    } catch (err) {
      console.error('fetchApplications error:', err);
      setError('Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [jobFilter, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusUpdate = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(id, newStatus);
      toast.success('Application status updated');
      await fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleDownloadResume = (resumeUrl: string, applicantName: string) => {
    const url = getImageSrc(resumeUrl);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${applicantName}-resume${resumeUrl.includes('.pdf') ? '.pdf' : '.doc'}`;
    link.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111]">Job Applications</h2>
        <p className="text-[#666]">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
        >
          <option value="all">All jobs</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
          className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="New">New</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          Loading applications...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : applications.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No applications found.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Job</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#666]">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#111]">{app.fullName}</p>
                          {app.coverLetter && (
                            <p className="max-w-[200px] truncate text-xs text-[#999]">
                              {app.coverLetter.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666]">{app.jobTitle}</td>
                      <td className="px-4 py-3 text-sm text-[#666]">
                        <div>
                          <p>{app.email}</p>
                          {app.phone && <p className="text-xs text-[#999]">{app.phone}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleDownloadResume(app.resumeUrl, app.fullName)}
                          >
                            Download CV
                          </Button>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value as ApplicationStatus)}
                            className="h-8 rounded-md border border-input bg-white px-2 text-xs"
                          >
                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
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
    </div>
  );
};
