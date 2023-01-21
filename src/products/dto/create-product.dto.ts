import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'The title of the product',
        example: 'Nike Air Max 270 React',
    })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'The price of the product',
        example: 100,
    })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        required: false,
        description: 'The description of the product',
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nunc nisl ultricies nunc, nec ultricies nisl nunc et nisl. Sed euismod, nisl vitae ultricies lacinia, nunc nisl ultricies nunc, nec ultricies nisl nunc et nisl.',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        required: false,
        description: 'The slug of the product',
        example: 'nike-air-max-270-react',
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        required: false,
        description: 'The stock of the product',
        example: 10,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number;

    @ApiProperty({
        required: true,
        description: 'The sizes of the product',
        example: ['S', 'M', 'L', 'XL'],
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        required: true,
        example: 'men'
    })
    @IsString()
    @IsIn(['men', 'women', 'kids', 'unisex'])
    gender: string;

    @ApiProperty({
        required: false,
        description: 'Tags of the product',
        example: ['fashion', 'shoes', 'home', 'smart home'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];


    @ApiProperty({
        required: false,
        description: 'Images of the product',
        example: ['http://image1.jpg'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
