// backend/src/app.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private jobStatusMap = new Map<string, string>();

  async generateJobId(): Promise<string> {
    const jobId = uuidv4();
    this.jobStatusMap.set(jobId, 'processing');
    return jobId;
  }

  async getJobStatus(jobId: string): Promise<string> {
    return this.jobStatusMap.get(jobId) || 'not found';
  }
}
