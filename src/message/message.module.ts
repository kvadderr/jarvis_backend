import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GatewayModule } from '../gateway/gateway.module'

import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { Message } from './message.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => GatewayModule),
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService, MessageModule]
})
export class MessageModule {}
