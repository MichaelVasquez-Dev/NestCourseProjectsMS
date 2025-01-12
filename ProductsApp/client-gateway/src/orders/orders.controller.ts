import { Controller, Get, Post, Body, Param, Inject, ParseIntPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICES } from 'config';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(ORDERS_SERVICES) private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersClient.send('findAllOrders', {});
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.ordersClient.send('findOneOrder', {id});
  }

} 
