import Lead from '../models/Lead.js';

/** Map legacy status to new: read->contacted, replied->converted */
function mapStatus(s) {
  if (s === 'read') return 'contacted';
  if (s === 'replied') return 'converted';
  return s || 'new';
}

/** Build filter for list/export: status (new|contacted|converted) and search (regex on name, email, message) */
function buildFilter(query) {
  const { status, search } = query;
  const filter = {};

  if (status && ['new', 'contacted', 'converted'].includes(status)) {
    if (status === 'contacted') filter.status = { $in: ['contacted', 'read'] };
    else if (status === 'converted') filter.status = { $in: ['converted', 'replied'] };
    else filter.status = 'new';
  }

  if (search && typeof search === 'string' && search.trim()) {
    const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: re },
      { email: re },
      { message: re },
    ];
  }

  return filter;
}

/** Map a lead doc for API response (status, include internalNotes, emailNotify) */
function toResponse(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  o.status = mapStatus(o.status);
  return o;
}

export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone = '', subject = '', message, status = 'new', source = 'admin' } = req.body;

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
      status: ['new', 'contacted', 'converted'].includes(status) ? status : 'new',
      source,
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: toResponse(lead),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);

    const leads = await Lead.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 });

    const data = leads.map((l) => toResponse(l));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/leads/export - CSV download. Same filters as getAllLeads. */
export const exportLeadsCsv = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const escape = (v) => {
      const s = String(v ?? '');
      if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const headers = ['name', 'email', 'phone', 'message', 'status', 'internalNotes', 'createdAt'];
    const rows = leads.map((l) =>
      headers.map((h) => (h === 'status' ? escape(mapStatus(l.status)) : escape(l[h])))
    );
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id).select('-__v');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      data: toResponse(lead),
    });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/leads/:id - update status, internalNotes, emailNotify, name, email, phone, message */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const $set = {};
    if (body.status !== undefined && ['new', 'contacted', 'converted'].includes(body.status)) $set.status = body.status;
    if (body.internalNotes !== undefined) $set.internalNotes = String(body.internalNotes || '').trim();
    if (body.emailNotify !== undefined) $set.emailNotify = !!body.emailNotify;
    if (body.name !== undefined) $set.name = String(body.name || '').trim();
    if (body.email !== undefined) $set.email = String(body.email || '').trim().toLowerCase();
    if (body.phone !== undefined) $set.phone = String(body.phone || '').trim();
    if (body.message !== undefined) $set.message = String(body.message || '').trim();

    if (Object.keys($set).length === 0) {
      const lead = await Lead.findById(id).select('-__v');
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
      return res.status(200).json({ success: true, message: 'No changes', data: toResponse(lead) });
    }

    const lead = await Lead.findByIdAndUpdate(id, { $set }, { new: true, runValidators: true }).select('-__v');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: toResponse(lead),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id).select('-__v');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: toResponse(lead),
    });
  } catch (error) {
    next(error);
  }
};
