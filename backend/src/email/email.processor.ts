import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailsGateway } from 'src/mails/mails.gateway';

@Processor('emails-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private readonly mailsGateway: MailsGateway) {}

  @Process('email-process')
  handleTranscode(job: Job) {
    this.logger.debug('Start Email processing...');
    this.logger.debug(job.data);
    this.logger.debug('Email sent');
    this.mailsGateway.sendMailsProcessing(job.data.emailIndex);

    if (job?.data?.emailIndex === job?.data?.totalEmails) {
      this.mailsGateway.sendMailsCompleted('Completed');
    }
  }
}
