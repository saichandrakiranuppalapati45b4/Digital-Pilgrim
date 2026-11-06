import { Request, Response } from 'express';
import { Announcement } from '../models/Announcement';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../validators/announcementValidator';

export const listAnnouncements = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { type, priority } = req.query;
    const filter: Record<string, any> = {};

    // Visitors only see active published announcements that haven't expired
    if (!req.user) {
      filter.isPublished = true;
      filter.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ];
    }

    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const announcements = await Announcement.find(filter)
      .sort('-publishedAt')
      .lean();

    return sendSuccess(res, announcements, 'Announcements retrieved');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const createAnnouncement = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = createAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid announcement data');
    }

    const announcement = await Announcement.create({
      ...parsed.data,
      createdBy: req.user?._id,
    });

    return sendSuccess(res, announcement, 'Announcement created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const parsed = updateAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid announcement data');
    }

    const announcement = await Announcement.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!announcement) {
      return sendError(res, 'Announcement not found', 404);
    }

    return sendSuccess(res, announcement, 'Announcement updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(res, 'Announcement not found', 404);
    }

    return sendSuccess(res, { id }, 'Announcement deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
