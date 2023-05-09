import { Body, Controller, Get, Post, Delete, Param, UseInterceptors, Res, UploadedFile } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.model'

@Controller('message')
export class MessageController {    
    constructor(private readonly messageService: MessageService) {}

    @Get('/:userId')
    getMyMessage(@Param('userId') userId: number) {
        console.log('userId', userId);
        return this.messageService.getMyMessage(userId);
    }

    @Delete('/:userId')
    deleteMyMessage(@Param('userId') userId: number) {
        return this.messageService.deleteMessages(userId);
    }

}