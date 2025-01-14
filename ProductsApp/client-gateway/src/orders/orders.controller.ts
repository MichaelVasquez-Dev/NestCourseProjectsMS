import { Controller, Get, Post, Body, Param, Inject, ParseIntPipe, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICES } from 'config';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // return this.ordersClient.send('findOneOrder', {id}).pipe(
    //   catchError(err => { throw new RpcException(err) })
    // );

    try {
      const order = await firstValueFrom(this.client.send('findOneOrder', {id}));
      return order;
    } catch (error) {
      throw new RpcException(error);
    }

  }

  @Get(':status')
  async findAllByStatus(@Param() statusDto: StatusDto, @Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const order = await firstValueFrom(this.client.send('findAllOrders', {...orderPaginationDto, ...statusDto}));
      return order; 
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      
      const order = await firstValueFrom(this.client.send('changeOrderStatus', {id, ...statusDto}));
      return order; 
    } catch (error) {
      throw new RpcException(error);
    }
  }

} 
