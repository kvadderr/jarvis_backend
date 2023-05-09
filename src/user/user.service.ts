import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor ( 
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async register() {
        const registerUser = await this.userRepository.save({});
        if (!registerUser) throw new HttpException ({ message: 'Ошибка при регистрации пользователя' }, HttpStatus.BAD_REQUEST);
        return registerUser;
    }

    async getMe(id: string) {
        return await this.userRepository.findOne({where: {id}});
    }

}