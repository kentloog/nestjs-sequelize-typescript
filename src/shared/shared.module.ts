import { Global, Module } from '@nestjs/common';
import { UsersModule } from './../users/users.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt-strategy';

@Global()
@Module({
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
    imports: [UsersModule],
    controllers: [],
})
export class SharedModule {}
