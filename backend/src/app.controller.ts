import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from 'nestjs-redis';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Post('sendEmails')
  async sendEmails(@Body() data: { numEmails: number }) {
    const jobId = await this.appService.generateJobId();
    const emailJob = { jobId, numEmails: data.numEmails };
    const redisClient = this.redisService.getClient();

    // Add job to Redis queue
    await redisClient.rpush('email-queue', JSON.stringify(emailJob));

    return { jobId };
  }

  @Get('getStatus/:jobId')
  async getStatus(@Param('jobId') jobId: string) {
    const status = await this.appService.getJobStatus(jobId);
    return { status };
  }
}
