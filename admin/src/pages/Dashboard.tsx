import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi, DashboardData } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  FileText,
  Users,
  Eye,
  Activity,
  FolderOpen,
  CheckCircle2,
  FileEdit,
} from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-[#e5e5e5] bg-white p-5">
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-[#e5e5e5]" />
            <div className="h-8 w-16 animate-pulse rounded bg-[#e5e5e5]" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-[#e5e5e5]" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-[#e5e5e5]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[#e5e5e5]" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[#e5e5e5] bg-white p-5">
        <div className="mb-4 h-5 w-32 animate-pulse rounded bg-[#e5e5e5]" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-[#e5e5e5]" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#e5e5e5]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#e5e5e5]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatActivityAction(action: string): string {
  const map: Record<string, string> = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    login: 'Logged in',
    view: 'Viewed',
  };
  return map[action] || action;
}

function formatActivityEntity(entity: string): string {
  return entity.charAt(0).toUpperCase() + entity.slice(1);
}

export const DashboardPage = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminApi.getDashboard();
        setData(res);
        setError('');
      } catch (e) {
        console.error('Failed to fetch dashboard:', e);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const ps = data?.projectsByStatus;
  const hasProjects = (ps?.draft ?? 0) + (ps?.active ?? 0) + (ps?.completed ?? 0) > 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111]">Dashboard</h2>
        <p className="text-[#666]">Welcome back, {admin?.email}!</p>
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {!loading && !error && data && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Projects by status */}
            <div className="rounded-lg border border-[#e5e5e5] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-[#666]">Projects by status</span>
              </div>
              {hasProjects ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-[#666]">
                      <FileEdit className="h-3.5 w-3" /> Draft
                    </span>
                    <span className="font-medium text-[#111]">{ps?.draft ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-[#666]">
                      <FolderOpen className="h-3.5 w-3" /> Active
                    </span>
                    <span className="font-medium text-[#111]">{ps?.active ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-[#666]">
                      <CheckCircle2 className="h-3.5 w-3" /> Completed
                    </span>
                    <span className="font-medium text-[#111]">{ps?.completed ?? 0}</span>
                  </div>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-[#999]">No projects yet</p>
              )}
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="mt-3 text-xs font-medium text-blue-600 hover:underline"
              >
                View projects →
              </button>
            </div>

            {/* Blogs this month */}
            <div className="rounded-lg border border-[#e5e5e5] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-green-50 p-2 text-green-700">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-[#666]">Blogs this month</span>
              </div>
              <p className="text-2xl font-bold text-[#111]">{data.blogsThisMonth ?? 0}</p>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="mt-3 text-xs font-medium text-green-600 hover:underline"
              >
                View blogs →
              </button>
            </div>

            {/* New users */}
            <div className="rounded-lg border border-[#e5e5e5] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-[#666]">New users</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-[#666]">Today:</span>{' '}
                  <span className="font-semibold text-[#111]">{data.newUsersToday ?? 0}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[#666]">This week:</span>{' '}
                  <span className="font-semibold text-[#111]">{data.newUsersThisWeek ?? 0}</span>
                </p>
              </div>
            </div>

            {/* Website visits */}
            <div className="rounded-lg border border-[#e5e5e5] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <Eye className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-[#666]">Website visits</span>
              </div>
              <p className="text-2xl font-bold text-[#111]">
                {(data.websiteVisits ?? 0).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#999]">Mock data</p>
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-lg border border-[#e5e5e5] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#666]" />
              <h3 className="text-sm font-medium text-[#111]">Recent activity</h3>
            </div>
            {data.recentActivities && data.recentActivities.length > 0 ? (
              <ul className="space-y-3">
                {data.recentActivities.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-b border-[#f0f0f0] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#666]">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#111]">
                        <span className="font-medium">{formatActivityAction(a.action)}</span>{' '}
                        {formatActivityEntity(a.entity)}
                        {a.details ? `: ${a.details}` : ''}
                      </p>
                      <p className="mt-0.5 text-xs text-[#999]">
                        {a.adminId?.email ?? 'Admin'} ·{' '}
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <Activity className="h-10 w-10 text-[#ddd]" />
                <p className="mt-2 text-sm text-[#999]">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
