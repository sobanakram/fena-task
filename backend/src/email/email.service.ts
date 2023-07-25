// backend/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmailService {
  private jobStatusMap = new Map<string, string>();
  constructor(
    @InjectQueue('emails-queue') private readonly emailsQueue: Queue,
  ) {}

  async generateJobId(): Promise<string> {
    const jobId = uuidv4();
    this.jobStatusMap.set(jobId, 'processing');
    return jobId;
  }

  async pushToQueue(emailJob: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.emailsQueue.add('email-process', emailJob);
        resolve();
      }, 1000);
    });
  }

  async getJobStatus(jobId: string): Promise<string> {
    return this.jobStatusMap.get(jobId) || 'not found';
  }
}
