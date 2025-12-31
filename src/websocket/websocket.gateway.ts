import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Unirse a un área/sala
  @SubscribeMessage('joinArea')
  handleJoinArea(
    @ConnectedSocket() client: Socket,
    @MessageBody() area: string,
  ) {
    client.join(area);
    console.log(`Client ${client.id} joined area: ${area}`);
    client.emit('joinedArea', `Te has unido al área: ${area}`);
  }

  // Salir de un área/sala
  @SubscribeMessage('leaveArea')
  handleLeaveArea(
    @ConnectedSocket() client: Socket,
    @MessageBody() area: string,
  ) {
    client.leave(area);
    console.log(`Client ${client.id} left area: ${area}`);
    client.emit('leftArea', `Has salido del área: ${area}`);
  }

  // Enviar mensaje solo a una área específica
  @SubscribeMessage('messageToArea')
  handleMessageToArea(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { area: string; message: any },
  ) {
    console.log(`Message to area ${data.area}:`, data.message);

    // Envía a todos en el área EXCEPTO al remitente
    client.to(data.area).emit('mensajeServer', data.message);

    // Si quieres incluir al remitente también:
    // this.server.to(data.area).emit('mensajeServer', data.message);
  }

  // Mensaje general (broadcast a todos)
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data);
    client.broadcast.emit('mensajeServer', data);
  }
}
