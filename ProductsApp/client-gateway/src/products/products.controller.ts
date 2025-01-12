import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICES } from 'config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(PRODUCT_SERVICES) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async getProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_product' }, {...paginationDto});
  }

  @Get(':id',)
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(this.productsClient.send({ cmd: 'find_one_product' }, {id}));
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateProduct(@Body() updateProductDto: UpdateProductDto ) {
    try {
      return this.productsClient.send({ cmd: 'update_product' }, updateProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, {id}).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }



}
