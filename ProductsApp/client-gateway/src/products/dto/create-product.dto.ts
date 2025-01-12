import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Boolean)
    available?: boolean;

}
