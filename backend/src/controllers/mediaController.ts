import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getUploadSignature = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { folder = 'digital-pilgrim', resourceType = 'auto' } = req.body;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
    };

    if (!env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_API_KEY) {
      return sendError(
        res,
        'Cloudinary credentials not fully configured in environment',
        500
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    );

    return sendSuccess(
      res,
      {
        signature,
        timestamp,
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
        folder,
        resourceType,
      },
      'Cloudinary upload signature generated'
    );
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteMedia = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.query;

    if (!publicId) {
      return sendError(res, 'Media public ID is required', 400);
    }

    if (!env.CLOUDINARY_API_SECRET) {
      return sendError(res, 'Cloudinary not configured', 500);
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as string,
    });

    return sendSuccess(res, result, 'Media deleted from Cloudinary');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
