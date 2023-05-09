import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GatewayModule } from '../gateway/gateway.module'

import { UserService } from './user.service'
import { User } from './user.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => GatewayModule),
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService, UserModule]
})
export class UserModule {}
