import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';
import { PRODUCT_SERVICES } from 'config/service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');
  
  constructor(
    @Inject(PRODUCT_SERVICES) private readonly productsClient: ClientProxy
  ){
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {

      const productsIds = createOrderDto.items.map(item => item.product_id);

      const products = await firstValueFrom(this.productsClient.send({ cmd: 'validate_products' }, productsIds));

      const totalAmount = createOrderDto.items.reduce((acc, product) => {
        const productData = products.find(p => p.id === product.product_id);
        return acc + productData.price * product.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, item) => acc + item.quantity, 0);

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map(item => ({
                quantity: item.quantity,
                productId: item.product_id,
                price: products.find(p => p.id === item.product_id).price
              }))
            }
          }
        },
        include: { 
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true
            }
          }
        }
      });

      
      return {
        ...order,
        OrderItem: order.OrderItem.map(item => ({ ...item, name: products.find(p => p.id === item.productId).name }))
      };
    } catch (error) {
      throw new RpcException({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Products service not available' });
    }
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
    const order = await this.order.findUnique({ 
      where: { id },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true
          }
        }
      }
    });

    if (!order)  throw new RpcException({ status: HttpStatus.NOT_FOUND, message: 'Order not found' });


    const productsIds = order.OrderItem.map(item => item.productId);
    const products = await firstValueFrom(this.productsClient.send({ cmd: 'validate_products' }, productsIds));

    return {
      ...order,
      OrderItem: order.OrderItem.map(item => ({ ...item, name: products.find(p => p.id === item.productId).name }))
    };
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
