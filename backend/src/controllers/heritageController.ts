import { Request, Response } from 'express';
import { Heritage } from '../models/Heritage';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { createHeritageSchema, updateHeritageSchema } from '../validators/heritageValidator';
import { generateSlug } from '../utils/slugify';
import { generateQRCodeDataUrl } from '../services/qrService';

export const listHeritage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      search,
      category,
      status,
      isFeatured,
      page = '1',
      limit = '12',
      sort = '-createdAt',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};

    // Visitors can ONLY view published items
    const isAuthenticated = !!req.user;
    if (!isAuthenticated) {
      filter.status = 'published';
    } else if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      filter.$or = [
        { 'name.en': searchRegex },
        { 'name.te': searchRegex },
        { 'description.en': searchRegex },
        { 'description.te': searchRegex },
        { address: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      Heritage.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Heritage.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return sendSuccess(res, items, 'Heritage locations retrieved', 200, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getFeaturedHeritage = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const featured = await Heritage.find({
      status: 'published',
      isFeatured: true,
    })
      .sort('-createdAt')
      .limit(6)
      .lean();

    return sendSuccess(res, featured, 'Featured heritage locations');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getHeritageBySlug = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { slug } = req.params;
    const filter: Record<string, any> = { slug };

    if (!req.user) {
      filter.status = 'published';
    }

    const heritage = await Heritage.findOne(filter);
    if (!heritage) {
      return sendError(res, 'Heritage location not found', 404);
    }

    // Ensure QR code is present; if not generated yet, generate and save
    if (!heritage.qrCode) {
      heritage.qrCode = await generateQRCodeDataUrl(heritage.slug);
      await heritage.save();
    }

    return sendSuccess(res, heritage, 'Heritage location details');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const createHeritage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = createHeritageSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid heritage data');
    }

    const data = parsed.data;
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name.en);

    // Ensure slug uniqueness
    const existingSlug = await Heritage.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const qrCode = await generateQRCodeDataUrl(slug);

    const newHeritage = await Heritage.create({
      ...data,
      slug,
      qrCode,
    });

    return sendSuccess(res, newHeritage, 'Heritage location created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateHeritage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const parsed = updateHeritageSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.format(), 422, 'Invalid heritage data');
    }

    const data = parsed.data;
    const heritage = await Heritage.findById(id);
    if (!heritage) {
      return sendError(res, 'Heritage location not found', 404);
    }

    if (data.slug && data.slug !== heritage.slug) {
      const cleanSlug = generateSlug(data.slug);
      const existing = await Heritage.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (existing) {
        return sendError(res, 'A heritage location with this slug already exists', 409);
      }
      data.slug = cleanSlug;
      heritage.qrCode = await generateQRCodeDataUrl(cleanSlug);
    }

    Object.assign(heritage, data);
    await heritage.save();

    return sendSuccess(res, heritage, 'Heritage location updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteHeritage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deleted = await Heritage.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(res, 'Heritage location not found', 404);
    }
    return sendSuccess(res, { id }, 'Heritage location deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
