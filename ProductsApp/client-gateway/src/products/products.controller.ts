import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICES } from 'config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return this.client.send({ cmd: 'create_product' }, createProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async getProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_product' }, {...paginationDto});
  }

  @Get(':id',)
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(this.client.send({ cmd: 'find_one_product' }, {id}));
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateProduct(@Body() updateProductDto: UpdateProductDto ) {
    try {
      return this.client.send({ cmd: 'update_product' }, updateProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'delete_product' }, {id}).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }



}
