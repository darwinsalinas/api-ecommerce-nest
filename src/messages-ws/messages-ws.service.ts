import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: {
        user: User,
        socket: Socket
    };
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async registerClient(client: Socket, userId: string) {

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.isActive) {
            throw new Error('User is not active');
        }

        this.checkUserConnection(user);

        this.connectedClients[client.id] = {
            user,
            socket: client
        };
    }

    removeClient(client: string) {
        delete this.connectedClients[client];
    }

    getConnectedClients() {
        return Object.keys(this.connectedClients)
    }

    getClient(clientId) {
        return this.connectedClients[clientId];
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];

            if (connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }

}
