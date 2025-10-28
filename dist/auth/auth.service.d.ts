import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(identifier: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
    }>;
    requestPasswordReset(requestDto: ResetPasswordRequestDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
