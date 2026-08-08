export interface JwtPayload {
    email: string;
    iat?: number;
    exp?: number;
}
