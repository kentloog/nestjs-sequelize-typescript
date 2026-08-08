import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user.entity';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface FakeRequest {
    headers: { authorization?: string };
    user?: User;
}

const createContext = (request: FakeRequest): ExecutionContext =>
    ({
        switchToHttp: () => ({ getRequest: () => request }),
    }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;

    const jwtService = {
        verifyAsync: jest.fn(),
    };
    const usersService = {
        getUserByEmail: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        guard = new JwtAuthGuard(
            jwtService as unknown as JwtService,
            usersService as unknown as UsersService,
        );
    });

    it('throws UnauthorizedException when there is no Authorization header', async () => {
        const context = createContext({ headers: {} });

        await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
        expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException for a non-Bearer Authorization header', async () => {
        const context = createContext({ headers: { authorization: 'Basic some-token' } });

        await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
        expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when token verification fails', async () => {
        jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));
        const context = createContext({ headers: { authorization: 'Bearer bad-token' } });

        await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
        expect(jwtService.verifyAsync).toHaveBeenCalledWith('bad-token');
        expect(usersService.getUserByEmail).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when the token subject is not a known user', async () => {
        jwtService.verifyAsync.mockResolvedValue({ email: 'ghost@example.com' });
        usersService.getUserByEmail.mockResolvedValue(null);
        const context = createContext({ headers: { authorization: 'Bearer valid-token' } });

        await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
        expect(usersService.getUserByEmail).toHaveBeenCalledWith('ghost@example.com');
    });

    it('returns true and attaches the user to the request for a valid token', async () => {
        const user = { id: 'user-id-1', email: 'jane@example.com' } as unknown as User;
        jwtService.verifyAsync.mockResolvedValue({ email: 'jane@example.com' });
        usersService.getUserByEmail.mockResolvedValue(user);
        const request: FakeRequest = { headers: { authorization: 'Bearer valid-token' } };

        const result = await guard.canActivate(createContext(request));

        expect(result).toBe(true);
        expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
        expect(request.user).toBe(user);
    });
});
