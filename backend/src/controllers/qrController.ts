import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { Heritage } from '../models/Heritage';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getQRByLocationId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { locationId } = req.params;
    const { format = 'json' } = req.query;

    const heritage = await Heritage.findOne({
      $or: [{ _id: locationId.match(/^[0-9a-fA-F]{24}$/) ? locationId : null }, { slug: locationId }],
    });

    if (!heritage) {
      return sendError(res, 'Heritage location not found', 404);
    }

    const destinationUrl = `${env.FRONTEND_URL}/heritage/${heritage.slug}`;

    if (format === 'png') {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="qr-${heritage.slug}.png"`
      );
      return QRCode.toFileStream(res, destinationUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 512,
        color: {
          dark: '#7B263A',
          light: '#FAF7F0',
        },
      });
    }

    const qrDataUrl = await QRCode.toDataURL(destinationUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#7B263A',
        light: '#FAF7F0',
      },
    });

    return sendSuccess(res, {
      locationId: heritage._id,
      slug: heritage.slug,
      name: heritage.name,
      destinationUrl,
      qrCodeDataUrl: qrDataUrl,
      downloadUrl: `${env.API_PREFIX}/qr/${heritage.slug}?format=png`,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
