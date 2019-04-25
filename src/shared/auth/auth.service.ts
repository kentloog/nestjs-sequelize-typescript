import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.model';
import { sign } from 'jsonwebtoken';
import { User } from './../../users/user.entity';

@Injectable()
export class AuthService {
    private readonly jwtPrivateKey: string;

    constructor() {
        this.jwtPrivateKey = 'jwtPrivateKey';
    }

    async signToken(user: User): Promise<string> {
        const payload: JwtPayload = {
            email: user.email,
        };

        const token = sign(payload, this.jwtPrivateKey, {});
        return token;
    }
}
