import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus, OrderStatusList } from "src/enum/order.enum";

export class CreateOrderDto {
    
    @IsNumber()
    @IsPositive()
    totalAmount: number;

    @IsInt()
    @IsPositive()
    totalItems: number;

    @IsEnum(OrderStatusList, { message: `Possible status values are ${OrderStatusList}` })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;

    @IsOptional()
    @IsBoolean()
    paid: boolean = false;

}