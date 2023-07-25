import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailsGateway } from 'src/mails/mails.gateway';
import { EmailService } from './email.service';

@Processor('emails-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(
    private readonly mailsGateway: MailsGateway,
    private readonly emailService: EmailService,
  ) {}

  @Process('email-process')
  async handleEmailSent(job: Job) {
    // await this.emailService.delay(1000);
    this.logger.debug('Start Email processing...');
    this.logger.debug(job.data);
    this.logger.debug('Email sent');
    await this.mailsGateway.sendMailsProcessing({
      currentMailCounter: job.data.currentIndex,
      jobId: job?.data?.jobId,
    });

    if (job?.data?.currentIndex === job?.data?.totalEmails) {
      await this.mailsGateway.sendMailsCompleted(job?.data?.jobId);
    }
  }

  @Process('email-bunch')
  async handleEmailBunch(job: Job) {
    this.logger.debug('Start Email Process');
    this.logger.debug(job.data);
    for (let i = 0; i < job?.data?.numEmails; i++) {
      await this.emailService.pushToQueue({
        currentIndex: i + 1,
        jobId: job?.data?.jobId,
        totalEmails: job?.data?.numEmails,
      });
    }
    this.logger.debug('End Email Process');
  }
}
