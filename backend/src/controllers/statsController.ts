import { Request, Response } from 'express';
import { Heritage } from '../models/Heritage';
import { Event } from '../models/Event';
import { Announcement } from '../models/Announcement';
import { Facility } from '../models/Facility';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getDashboardStats = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [
      totalHeritage,
      publishedHeritage,
      draftHeritage,
      archivedHeritage,
      totalEvents,
      totalAnnouncements,
      totalFacilities,
      categoryCounts,
    ] = await Promise.all([
      Heritage.countDocuments(),
      Heritage.countDocuments({ status: 'published' }),
      Heritage.countDocuments({ status: 'draft' }),
      Heritage.countDocuments({ status: 'archived' }),
      Event.countDocuments(),
      Announcement.countDocuments(),
      Facility.countDocuments(),
      Heritage.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    // Count audio tracks across all heritage sites
    const audioCountResult = await Heritage.aggregate([
      { $unwind: '$audioGuides' },
      { $count: 'totalAudio' },
    ]);
    const totalAudioGuides = audioCountResult[0]?.totalAudio || 0;

    return sendSuccess(
      res,
      {
        heritage: {
          total: totalHeritage,
          published: publishedHeritage,
          draft: draftHeritage,
          archived: archivedHeritage,
          byCategory: categoryCounts.reduce((acc: Record<string, number>, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
        },
        events: {
          total: totalEvents,
        },
        announcements: {
          total: totalAnnouncements,
        },
        facilities: {
          total: totalFacilities,
        },
        totalAudioGuides,
      },
      'Dashboard statistics calculated from database'
    );
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
