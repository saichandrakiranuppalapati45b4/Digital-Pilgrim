import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { createEventSchema, updateEventSchema } from '../validators/eventValidator';

export const listEvents = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { status, limit = '20' } = req.query;
    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    const events = await Event.find(filter)
      .sort('startDate')
      .limit(parseInt(limit as string, 10))
      .lean();

    return sendSuccess(res, events, 'Events retrieved');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const createEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid event data');
    }

    const event = await Event.create(parsed.data);
    return sendSuccess(res, event, 'Event created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid event data');
    }

    const event = await Event.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    return sendSuccess(res, event, 'Event updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(res, 'Event not found', 404);
    }

    return sendSuccess(res, { id }, 'Event deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
