import { Injectable } from '@nestjs/common';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { AvailableFormatInfo, FormatEnum } from 'sharp';
import s3 from '@/infra/config/aws';
import { generateUrlFromS3FileName } from '@/application/utils/generate-url-from-s3-file-name';

interface UploadUniqueFileToS3ServiceExecuteProps {
  fileName: string;
  path: string;
  buffer: Buffer;
  mimetype: AvailableFormatInfo | keyof FormatEnum;
}

@Injectable()
export class UploadUniqueFileToS3Service {
  async execute(data: UploadUniqueFileToS3ServiceExecuteProps) {
    return new Promise<string>((resolve, reject) => {
      const params: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: data.fileName,
        Body: data.buffer,
        ContentType: data.mimetype as string,
        ContentDisposition: 'inline',
        ACL: 'public-read',
      };

      s3.putObject(params, (err) => {
        if (err) reject(err);
        resolve(generateUrlFromS3FileName(data.fileName));
      });
    });
  }
}
