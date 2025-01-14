import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    Logger.log('Connected to the database', 'ProductsService');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } });

    return {
      data: await this.product.findMany({ where: { available: true }, skip: (page - 1) * limit, take: limit }),
      meta: { page: page, total: totalPages, totalPages: Math.ceil(totalPages / limit) }
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({ where: { id, available: true} });
    // if (!product) throw new RpcException(`Product with id: ${id} not found`);
    if (!product) throw new RpcException({
      message: `Product with id: ${id} not found`, 
      status: HttpStatus.BAD_REQUEST
    });
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id:__ , ...data} = updateProductDto;
    await this.findOne(id);
    return await this.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    // return await this.product.delete({ where: { id } });

    return await this.product.update({ where: { id }, data: { available: false } });
  }


  async validateProducts(productsIds: number[]) {

    const ids = Array.from(new Set(productsIds));

    const products = await this.product.findMany({ where: { id: { in: ids } } });

    if (products.length !== ids.length) throw new RpcException({ message: 'Some products were not found', status: HttpStatus.BAD_REQUEST });
    
    return products;
  }

}
