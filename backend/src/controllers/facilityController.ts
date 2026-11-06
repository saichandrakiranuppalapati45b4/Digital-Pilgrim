import { Request, Response } from 'express';
import { Facility } from '../models/Facility';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { createFacilitySchema, updateFacilitySchema } from '../validators/facilityValidator';

export const listFacilities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { type, verifiedOnly } = req.query;
    const filter: Record<string, any> = { isActive: true };

    if (type) {
      filter.type = type;
    }
    if (verifiedOnly === 'true') {
      filter.isVerified = true;
    }

    const facilities = await Facility.find(filter).sort('name.en').lean();
    return sendSuccess(res, facilities, 'Facilities retrieved');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getFacilityById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);
    if (!facility) {
      return sendError(res, 'Facility not found', 404);
    }
    return sendSuccess(res, facility, 'Facility retrieved');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const createFacility = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = createFacilitySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid facility data');
    }

    const facility = await Facility.create(parsed.data);
    return sendSuccess(res, facility, 'Facility created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateFacility = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const parsed = updateFacilitySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid facility data');
    }

    const facility = await Facility.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!facility) {
      return sendError(res, 'Facility not found', 404);
    }

    return sendSuccess(res, facility, 'Facility updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteFacility = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deleted = await Facility.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(res, 'Facility not found', 404);
    }

    return sendSuccess(res, { id }, 'Facility deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
