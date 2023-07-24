import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@songkeys/nestjs-redis';
import { EmailGateway } from './email.gateway';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmailGateway],
})
export class AppModule {}
