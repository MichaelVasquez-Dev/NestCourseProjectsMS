import { OrderStatus } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";
import { OrderStatusList } from "../enum/enum";

export class ChangeOrderStatusDto {
    
    @IsUUID(4)
    id: string;

    @IsEnum(OrderStatusList, { message: `Valid status are ${ OrderStatusList }` })
    status: OrderStatus;

}