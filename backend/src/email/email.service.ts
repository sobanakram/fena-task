// backend/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Job, Queue } from 'bull';
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

  async pushToQueue(emailJob: any): Promise<Job> {
    return this.emailsQueue.add('email-process', emailJob);
  }

  async pushEmailCounter(emailJob: any): Promise<Job> {
    return await this.emailsQueue.add('email-bunch', emailJob);
  }

  async getQueueStatus(jobId: string) {
    const jobs = await this.emailsQueue.getJobs(['delayed']);
    let delayedJob = 0;
    for (let i = 0; i < jobs?.length; i++) {
      console.log(jobs[i].data);
      if (jobs[i]?.data?.jobId === jobId) {
        delayedJob += 1;
      }
    }
    return delayedJob;
  }

  async getJobStatus(jobId: string): Promise<string> {
    return this.jobStatusMap.get(jobId) || 'not found';
  }
}
