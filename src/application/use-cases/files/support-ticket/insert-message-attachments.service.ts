import { Injectable } from '@nestjs/common';
import { CompressPictureService } from '../compress-picture.service';
import { UploadUniqueFileToS3Service } from '../upload-unique-file-to-s3.service';
import * as fs from 'node:fs';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { getExtensionFromFileName } from '@/application/utils/get-extension-from-file-name';

interface InsertMessageAttachmentsServiceExecuteProps {
  ticketId: string;
  senderId: string;
  files: Express.Multer.File[];
}

@Injectable()
export class InsertMessageAttachmentsService {
  constructor(
    private supportTicketMessagesRepository: SupportTicketMessagesRepository,
    private compressPictureService: CompressPictureService,
    private uploadUniqueFileToS3Service: UploadUniqueFileToS3Service,
  ) {}

  async execute({
    files,
    senderId,
    ticketId,
  }: InsertMessageAttachmentsServiceExecuteProps) {
    const attachmentsPromises = files.map(async (file) => {
      const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

      const isDocumentAnImage = imageMimeTypes.some(
        (mime) => mime === file.mimetype,
      );

      let fileNameUploaded: string;

      if (isDocumentAnImage) {
        const mimetype = 'webp';

        const newName = file.filename.split('.')[0] + '.' + mimetype;

        const fileCompressed = await this.compressPictureService.execute({
          mimetype: mimetype,
          path: file.path,
          size: 800,
          quality: 60,
        });

        const fileBuffer = fileCompressed.buffer;

        fileNameUploaded = await this.uploadUniqueFileToS3Service.execute({
          fileName: 'support-ticket/' + newName,
          mimetype,
          buffer: fileBuffer,
        });
      }

      if (!isDocumentAnImage) {
        const extension = getExtensionFromFileName(file.originalname);

        const newName = file.filename.split('.')[0] + '.' + extension;

        const fileBuffer = await fs.promises.readFile(file.path);

        fileNameUploaded = await this.uploadUniqueFileToS3Service.execute({
          fileName: 'support-ticket/' + newName,
          mimetype: file.mimetype,
          buffer: fileBuffer,
        });
      }

      fs.unlink(file.path, (err) => {
        if (err) console.error(err);
      });

      return this.supportTicketMessagesRepository.create({
        ticket: { connect: { id: ticketId } },
        sender: { connect: { id: senderId } },
        attachment: fileNameUploaded,
      });
    });

    const attachments = await Promise.all(attachmentsPromises);

    return attachments.map((attachment) => ({ message_ticket: attachment }));
  }
}
