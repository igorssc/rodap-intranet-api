import * as sharp from 'sharp';

interface CompressPictureServiceExecuteProps {
  path: string;
  mimetype: keyof sharp.FormatEnum | sharp.AvailableFormatInfo;
  size?: number;
  quality?: number;
}

export class CompressPictureService {
  async execute({
    path,
    size = 500,
    quality = 50,
    mimetype,
  }: CompressPictureServiceExecuteProps) {
    const buffer = await sharp(path)
      .resize(size)
      .toFormat(mimetype, { quality })
      .toBuffer();

    return { buffer };
  }
}
