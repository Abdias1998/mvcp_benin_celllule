import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): any;
}
