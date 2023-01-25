import { IsEmail, IsStrongPassword, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {

    @IsEmail()
    @ApiProperty({ type: String, description: 'Email' })
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'Password must have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol'
    })
    password: string;

    @IsString()
    @ApiProperty({ type: String, description: 'Full name' })
    fullName: string;
}
