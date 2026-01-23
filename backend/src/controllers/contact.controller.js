import Lead from '../models/Lead.js';

/**
 * Public contact form submission. No auth required.
 * POST /api/contacts
 */
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone = '', subject = '', message } = req.body;

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
      status: 'new',
      source: req.body.source || 'website',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.',
      data: { id: lead._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contacts – Admin only. List contact form submissions (from Lead), sort by date.
 */
export const getContacts = async (req, res, next) => {
  try {
    const { status, search, read } = req.query;
    const filter = {};

    if (status && ['new', 'contacted', 'converted', 'read', 'replied'].includes(status)) {
      if (status === 'contacted') filter.status = { $in: ['contacted', 'read'] };
      else if (status === 'converted') filter.status = { $in: ['converted', 'replied'] };
      else filter.status = status;
    }
    if (read === 'true') filter.read = true;
    if (read === 'false') filter.read = false;

    if (search && String(search).trim()) {
      const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { email: re }, { message: re }];
    }

    const contacts = await Lead.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contacts/:id – Admin only. Get single contact.
 */
export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Lead.findById(id).select('-__v');

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/contacts/:id – Admin only. Update contact (mark as read, status, internalNotes).
 */
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read, status, internalNotes, emailNotify } = req.body;

    const updateData = {};
    if (typeof read === 'boolean') updateData.read = read;
    if (status && ['new', 'contacted', 'converted', 'read', 'replied'].includes(status)) updateData.status = status;
    if (internalNotes !== undefined) updateData.internalNotes = String(internalNotes || '').trim();
    if (typeof emailNotify === 'boolean') updateData.emailNotify = emailNotify;

    if (Object.keys(updateData).length === 0) {
      const contact = await Lead.findById(id).select('-__v');
      if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
      return res.status(200).json({ success: true, message: 'No changes', data: contact });
    }

    const contact = await Lead.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select('-__v');

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contacts/export – Admin only. Export contacts to CSV.
 */
export const exportContactsCsv = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && ['new', 'contacted', 'converted', 'read', 'replied'].includes(status)) {
      if (status === 'contacted') filter.status = { $in: ['contacted', 'read'] };
      else if (status === 'converted') filter.status = { $in: ['converted', 'replied'] };
      else filter.status = status;
    }
    if (search && String(search).trim()) {
      const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { email: re }, { message: re }];
    }

    const contacts = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const escape = (v) => {
      const s = String(v ?? '');
      if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const headers = ['name', 'email', 'phone', 'message', 'status', 'read', 'internalNotes', 'createdAt'];
    const rows = contacts.map((c) =>
      headers.map((h) => escape(c[h]))
    );
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const filename = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/contacts/:id – Admin only.
 */
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Lead.findByIdAndDelete(id).select('-__v');

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
