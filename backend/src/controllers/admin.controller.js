import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Lead from '../models/Lead.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * GET /api/admin/dashboard
 * Protected (admin only). Returns analytics for the admin dashboard.
 */
export const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();

    // Start of today (UTC dates for consistency with MongoDB)
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Start of this week (last 7 days from start of today)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - 7);

    // Start and end of current month
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    const notArchived = { archived: { $ne: true } };

    // --- projectsCount (exclude archived) ---
    const projectsCount = await Project.countDocuments(notArchived);

    // --- projectsByStatus: status removed; all non-archived are "active" for dashboard compatibility ---
    const projectsByStatus = {
      draft: 0,
      active: projectsCount,
      completed: 0,
    };

    // --- blogsThisMonth ---
    const blogsThisMonth = await Blog.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // --- newUsersToday, newUsersThisWeek ---
    const [newUsersToday, newUsersThisWeek] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
    ]);

    // --- websiteVisits: mock value ---
    const websiteVisits = 1250;

    // --- recentActivities: last 5 admin actions ---
    const recentActivities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('adminId', 'email')
      .select('action entity entityId details createdAt')
      .lean();

    // Optional: total counts for backward compatibility with existing admin Dashboard
    const [totalBlogs, totalLeads, totalUsers] = await Promise.all([
      Blog.countDocuments(),
      Lead.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      projectsCount,
      projectsByStatus,
      blogsThisMonth,
      newUsersToday,
      newUsersThisWeek,
      websiteVisits,
      recentActivities,
      // Backward compatibility
      totalProjects: projectsCount,
      totalBlogs,
      totalLeads,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};
