import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "@prisma/client";
import { PaginationDto } from "../common";
import { OrderStatusList } from "../enum/enum";


export class OrderPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum(OrderStatusList, { message: `Valid status are ${ OrderStatusList }` })
    status: OrderStatus;

}