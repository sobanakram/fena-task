import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';
import { MailsGateway } from 'src/mails/mails.gateway';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emails-queue',
      processors: [join(__dirname, 'processor.js')],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailProcessor, EmailService, MailsGateway],
})
export class EmailModule {}
