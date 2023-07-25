import { Controller, Post, Body, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailsGateway } from '../mails/mails.gateway';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Response } from 'express';

@Controller('api')
export class EmailController {
  constructor(
    @InjectQueue('emails-queue') private readonly emailsQueue: Queue,
    private readonly emailService: EmailService,
    private readonly mailsGateway: MailsGateway,
  ) {}

  @Post('sendEmails')
  async sendEmails(@Body() data: { numEmails: number }, @Res() res: Response) {
    const jobId = await this.emailService.generateJobId();

    res.status(HttpStatus.OK).send({ jobId });

    for (let i = 0; i < data.numEmails; i++) {
      const emailJob = { emailIndex: i + 1, totalEmails: data.numEmails };

      // Add job to Redis queue
      await this.emailService.pushToQueue(emailJob);
    }
  }
}
