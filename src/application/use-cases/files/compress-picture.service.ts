import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

interface CompressPictureServiceExecuteProps {
  fileName: string;
  path: string;
  mimetype: keyof sharp.FormatEnum | sharp.AvailableFormatInfo;
  size?: number;
  quality?: number;
}

@Injectable()
export class CompressPictureService {
  async execute({
    fileName,
    path,
    size = 500,
    quality = 50,
    mimetype,
  }: CompressPictureServiceExecuteProps) {
    const newName = fileName.split('.')[0] + '.' + mimetype;

    const buffer = await sharp(path)
      .resize(size)
      .toFormat(mimetype, { quality })
      .toBuffer();

    return { fileName: newName, mimetype, buffer };
  }
}
