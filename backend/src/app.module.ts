import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailsGateway } from './mails/mails.gateway';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      limiter: {
        max: 1,
        duration: 2000,
      },
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailsGateway],
})
export class AppModule {}
