import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { SocketService } from './gateway/gateway.service'
import { UserService } from './user/user.service'
import { MessageService } from './message/message.service'
import fetch from "node-fetch";

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketService: SocketService,
        private userService: UserService,
        private messageService: MessageService,
    ){}
    
    @WebSocketServer() public server: Server;
    private logger: Logger = new Logger('AppGateway');

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }  

    afterInit(server: Server) {
        this.socketService.socket = server;
        let users = {}

        const userService = this.userService
        const messageService = this.messageService
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        const API_KEY = process.env.CHAT_KEY;

        this.socketService.socket.on('connection', (socket) => {
            
            let userID = null

            socket.on('join', async function (data) {
                if (data) {
                    const user = await userService.getMe(data);
                    userID = data } 
                else {
                    const newUser = await userService.register();
                    socket.emit('uuid', newUser.id)
                    userID = newUser.id; }
                socket.join(userID)
                users[socket.id] = userID
            });

            socket.on('message', async function (data) {

                const userMessage = {userId: userID, content: data, role: 'user'}
                const lastMessages = [{content: data, role: 'user'}]
                messageService.saveMessage(userMessage);
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + API_KEY,
                    },
                    body: JSON.stringify({"model": "gpt-3.5-turbo", "messages": lastMessages}),
                });
                const json = await response.json();
                let assistantMessage;
                console.log(json);
                if (json.choices[0].message.content) {
                    assistantMessage = {userId: userID, content: json.choices[0].message.content, role: 'assistant'}
                } else {
                     assistantMessage = {userId: userID, content: 'Ошибка при отправке запроса. Повторите попытку', role: 'assistant'}
                }
                socket.emit('message', assistantMessage)
                messageService.saveMessage(assistantMessage);
            })
        })
    }
}