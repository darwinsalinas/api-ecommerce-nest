import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {

    @IsEmail()
    @ApiProperty({ type: String, description: 'Email' })
    email: string;

    @IsString()
    @ApiProperty({ type: String, description: 'Password' })
    password: string;
}
