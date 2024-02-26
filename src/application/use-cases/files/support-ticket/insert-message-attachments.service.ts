import { Injectable } from '@nestjs/common';
import { CompressPictureService } from '../compress-picture.service';
import { UploadUniqueFileToS3Service } from '../upload-unique-file-to-s3.service';
import * as fs from 'node:fs';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';

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
      const fileCompressed = await this.compressPictureService.execute({
        fileName: file.filename,
        mimetype: 'webp',
        path: file.path,
        size: 500,
        quality: 50,
      });

      const fileNameUploaded = await this.uploadUniqueFileToS3Service.execute({
        fileName: 'support-ticket/' + fileCompressed.fileName,
        mimetype: fileCompressed.mimetype,
        buffer: fileCompressed.buffer,
      });

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
