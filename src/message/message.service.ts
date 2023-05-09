import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor ( 
        @InjectRepository(Message) private messageRepository: Repository<Message>,
    ) {}

    async saveMessage(message: Partial<Message>) {
        const savedMessage = await this.messageRepository.save(message);
        if (!savedMessage) throw new HttpException ({ message: 'Ошибка при сохранении сообщения' }, HttpStatus.BAD_REQUEST);
        return savedMessage;
    }

    async getMyMessage(userId: number) {
        return await this.messageRepository.find({
            where: {userId}
        })
    }

    async getLimitedMessage(userId: number) {
        return await this.messageRepository.find({
            where: {userId},
            take: 3
        })
    }

    async deleteMessages(userId: number){
        return await this.messageRepository.delete({userId: userId})
      }

}