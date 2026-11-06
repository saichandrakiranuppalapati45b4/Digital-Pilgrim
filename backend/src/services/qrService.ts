import QRCode from 'qrcode';
import { env } from '../config/env';

export const generateQRCodeDataUrl = async (slug: string): Promise<string> => {
  const destinationUrl = `${env.FRONTEND_URL}/heritage/${slug}`;
  try {
    const dataUrl = await QRCode.toDataURL(destinationUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#7B263A', // Primary maroon
        light: '#FAF7F0', // Ivory background
      },
    });
    return dataUrl;
  } catch (error) {
    console.error(`Failed to generate QR code for ${slug}:`, error);
    return '';
  }
};
