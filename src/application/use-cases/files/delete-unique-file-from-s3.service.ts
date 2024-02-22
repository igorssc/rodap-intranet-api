import { Injectable } from '@nestjs/common';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import s3 from '@/infra/config/aws';

@Injectable()
export class DeleteUniqueFileFromS3Service {
  async execute(fileName: string) {
    return new Promise<boolean>((resolve, reject) => {
      const params: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
      };

      s3.deleteObject(params, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}
