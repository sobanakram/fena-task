import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: '*' })
export class MailsGateway {
  @WebSocketServer()
  server;

  sendMailsProcessing(message: string) {
    this.server.emit('email-processing', message);
  }

  sendMailsCompleted(message: string) {
    this.server.emit('email-completed', message);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log({ message });
    this.server.emit('message', message);
  }
}
