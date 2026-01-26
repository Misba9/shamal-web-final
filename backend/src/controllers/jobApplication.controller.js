import mongoose from 'mongoose';
import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';

function safeTrim(s) {
  return s == null ? '' : String(s).trim();
}

export const submitApplication = async (req, res, next) => {
  try {
    const { jobId, fullName, email, phone, coverLetter, resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Resume is required',
      });
    }

    // Verify job exists and is active
    const job = await Job.findById(jobId).select('title isActive').lean();
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      });
    }

    const application = await JobApplication.create({
      jobId,
      jobTitle: job.title,
      fullName: safeTrim(fullName),
      email: safeTrim(email).toLowerCase(),
      phone: safeTrim(phone) || '',
      coverLetter: safeTrim(coverLetter) || '',
      resumeUrl: safeTrim(resumeUrl),
      status: 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const jobId = req.query.jobId;

    const filter = {};
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      filter.jobId = jobId;
    }

    const applications = await JobApplication.find(filter)
      .select('-__v')
      .populate('jobId', 'title slug')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const applications = await JobApplication.find({ jobId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID format',
      });
    }

    const validStatuses = ['New', 'Reviewed', 'Shortlisted', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v').populate('jobId', 'title slug');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
