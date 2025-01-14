import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {

    @IsNumber()
    @IsPositive()
    product_id: number;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;
}