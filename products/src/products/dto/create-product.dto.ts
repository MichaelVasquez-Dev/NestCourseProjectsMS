import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description?: string

    @IsInt()
    @Min(0)
    @Type(() => Number)
    price: number;
    
}
