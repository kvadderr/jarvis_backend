import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Message } from './message/message.model'
import { User } from './user/user.model'

import { MessageModule } from './message/message.module'
import { UserModule } from './user/user.module'
import { GatewayModule }  from './gateway/gateway.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      synchronize: true,
      migrationsRun: true, 
      entities: [
        Message,
        User
      ],
      subscribers: ['dist/subscriber/*.js'],
      migrations: ['dist/migration/*.js'],
    }),
    MessageModule,
    UserModule,
    GatewayModule
  ],
  providers: [AppModule, AppGateway],
})
export class AppModule {}
