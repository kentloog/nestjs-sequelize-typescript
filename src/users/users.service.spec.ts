import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { compare, genSalt, hash } from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import { Gender } from '../shared/enum/gender';
import { UserDto } from './dto/user.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

jest.mock('bcrypt');

const mockSave = jest.fn();

// The real entity cannot be instantiated without an initialized sequelize
// connection, but UsersService.create() does `new User()` + `user.save()`.
jest.mock('./user.entity', () => ({
    User: class User {
        save = mockSave;
    },
}));

const compareMock = compare as unknown as jest.Mock<Promise<boolean>, [string, string]>;
const genSaltMock = genSalt as unknown as jest.Mock<Promise<string>, [number]>;
const hashMock = hash as unknown as jest.Mock<Promise<string>, [string, string]>;

const buildUser = (overrides: Partial<Record<keyof User, unknown>> = {}): User =>
    ({
        id: 'user-id-1',
        email: 'jane@example.com',
        password: 'hashed-password',
        firstName: 'Jane',
        lastName: 'Doe',
        gender: Gender.female,
        birthday: '1990-01-01',
        destroy: jest.fn(),
        ...overrides,
    }) as unknown as User;

describe('UsersService', () => {
    let service: UsersService;

    const usersRepository = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
    };
    const jwtService = {
        signAsync: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getModelToken(User), useValue: usersRepository },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get(UsersService);
    });

    describe('findAll', () => {
        it('returns all users mapped to UserDto without exposing passwords', async () => {
            const users = [buildUser(), buildUser({ id: 'user-id-2', email: 'joe@example.com' })];
            usersRepository.findAll.mockResolvedValue(users);

            const result = await service.findAll();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(UserDto);
            expect(result[0]).toEqual(new UserDto(users[0]));
            expect(result[1].id).toBe('user-id-2');
            expect(result[0]).not.toHaveProperty('password');
        });
    });

    describe('getUser', () => {
        it('returns a UserDto when the user exists', async () => {
            const user = buildUser();
            usersRepository.findByPk.mockResolvedValue(user);

            const result = await service.getUser('user-id-1');

            expect(usersRepository.findByPk).toHaveBeenCalledWith('user-id-1');
            expect(result).toBeInstanceOf(UserDto);
            expect(result).toEqual(new UserDto(user));
        });

        it('throws a 404 HttpException when the user is not found', async () => {
            usersRepository.findByPk.mockResolvedValue(null);

            const promise = service.getUser('missing-id');

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
        });
    });

    describe('login', () => {
        const credentials = { email: 'jane@example.com', password: 'secret123' };

        it('throws a 400 HttpException for an unknown email', async () => {
            usersRepository.findOne.mockResolvedValue(null);

            const promise = service.login(credentials);

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({
                status: HttpStatus.BAD_REQUEST,
                message: 'Invalid email or password.',
            });
            expect(compareMock).not.toHaveBeenCalled();
        });

        it('throws a 400 HttpException for a wrong password', async () => {
            usersRepository.findOne.mockResolvedValue(buildUser());
            compareMock.mockResolvedValue(false);

            const promise = service.login(credentials);

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });
            expect(compareMock).toHaveBeenCalledWith('secret123', 'hashed-password');
        });

        it('returns a UserLoginResponseDto with a token on success', async () => {
            const user = buildUser();
            usersRepository.findOne.mockResolvedValue(user);
            compareMock.mockResolvedValue(true);
            jwtService.signAsync.mockResolvedValue('jwt-token');

            const result = await service.login(credentials);

            expect(jwtService.signAsync).toHaveBeenCalledWith({ email: 'jane@example.com' });
            expect(result).toBeInstanceOf(UserLoginResponseDto);
            expect(result.token).toBe('jwt-token');
            expect(result.email).toBe('jane@example.com');
        });
    });

    describe('create', () => {
        const createUserDto = {
            email: ' New@Example.COM ',
            password: 'secret123',
            firstName: 'Jane',
            lastName: 'Doe',
            gender: Gender.female,
            birthday: '1990-01-01',
        };

        it('hashes the password, saves the user and returns a login response', async () => {
            genSaltMock.mockResolvedValue('generated-salt');
            hashMock.mockResolvedValue('hashed-secret');
            mockSave.mockResolvedValue(buildUser({ email: 'new@example.com' }));
            jwtService.signAsync.mockResolvedValue('jwt-token');

            const result = await service.create(createUserDto);

            expect(hashMock).toHaveBeenCalledWith('secret123', 'generated-salt');
            expect(result).toBeInstanceOf(UserLoginResponseDto);
            expect(result.token).toBe('jwt-token');
            expect(result.email).toBe('new@example.com');
        });

        it('maps UniqueConstraintError to a 409 with the normalized email', async () => {
            mockSave.mockRejectedValue(new UniqueConstraintError({}));

            const promise = service.create(createUserDto);

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({
                status: HttpStatus.CONFLICT,
                message: "User with email 'new@example.com' already exists",
            });
        });

        it('maps any other error to a 500', async () => {
            mockSave.mockRejectedValue(new Error('connection lost'));

            const promise = service.create(createUserDto);

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        });
    });

    describe('delete', () => {
        it('throws a 404 HttpException when the user is not found', async () => {
            usersRepository.findByPk.mockResolvedValue(null);

            const promise = service.delete('missing-id');

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
        });

        it('destroys the user and returns its dto when found', async () => {
            const destroy = jest.fn();
            const user = buildUser({ destroy });
            usersRepository.findByPk.mockResolvedValue(user);

            const result = await service.delete('user-id-1');

            expect(destroy).toHaveBeenCalledTimes(1);
            expect(result).toBeInstanceOf(UserDto);
            expect(result.id).toBe('user-id-1');
        });
    });
});
