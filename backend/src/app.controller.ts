import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from '@songkeys/nestjs-redis';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Post('sendEmails')
  async sendEmails(@Body() data: { numEmails: number }) {
    const jobId = await this.appService.generateJobId();
    const jobIds = [];
    const redisClient = this.redisService.getClient();

    for (let i = 0; i < data.numEmails; i++) {
      const emailJob = { emailIndex: i + 1, totalEmails: data.numEmails };

      // Add job to Redis queue
      await redisClient.rpush('email-queue', JSON.stringify(emailJob));

      jobIds.push(jobId);
    }

    return { jobId };
  }
}
