import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

function isMongoDuplicate(err) {
  return err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000);
}

/**
 * POST /api/newsletter – Public. Subscribe with email.
 */
export const subscribe = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter.',
      });
    }

    await NewsletterSubscriber.create({ email });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter.',
    });
  } catch (error) {
    if (isMongoDuplicate(error)) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter.',
      });
    }
    next(error);
  }
};

/**
 * GET /api/newsletter – Admin only. List all subscribers.
 */
export const getAll = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/newsletter/export – Admin only. Export subscribers to CSV.
 */
export const exportCsv = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();

    const escape = (v) => {
      const s = String(v ?? '');
      if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const headers = ['email', 'subscribedAt'];
    const rows = subscribers.map((s) => [
      escape(s.email),
      escape(s.createdAt ? new Date(s.createdAt).toISOString() : ''),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const filename = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/newsletter/:id – Admin only. Remove subscriber.
 */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber removed successfully',
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};
