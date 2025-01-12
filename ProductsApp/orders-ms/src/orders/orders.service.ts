import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    return await this.order.create({
      data: createOrderDto
    });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const { limit, page, status } = orderPaginationDto;

    const total = await this.order.count({ where: { status } });



    return {
      data: await this.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status },
      }),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      }
    }
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({ where: { id } });

    if (!order)  throw new RpcException({ status: HttpStatus.NOT_FOUND, message: 'Order not found' });

    return order;
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Order already in this status' });

    return await this.order.update({
      where: { id },
      data: { status }
    });

  }

}
