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

    await this.emailService.pushEmailCounter({
      jobId,
      numEmails: data.numEmails,
    });

    res.status(HttpStatus.OK).send({ jobId });
  }

  @Get('job-status/:jobId')
  async getJobStatus(@Res() res: Response, @Param('jobId') jobId: string) {
    try {
      const delayedJobs = await this.emailService.getQueueStatus(jobId);
      res.status(HttpStatus.OK).json({delayedJobs});
    //   return delayedJobs;
    } catch (err) {
      return 'error';
    }
  }
}
