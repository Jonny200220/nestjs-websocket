import { Module } from '@nestjs/common';
import { GateWayModule } from './websocket/websocket.module';

@Module({
  imports: [GateWayModule],
})
export class AppModule {}
