import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';

import { User } from '../user/user.model'

@Entity()
export class Message extends AppEntity {

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: true})
    userId: number;

    @Column({ nullable: true})
    content: string;

    @Column({ nullable: true})
    role: string;

}