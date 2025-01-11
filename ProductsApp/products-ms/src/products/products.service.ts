import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

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
      where: { available: true },
      data: await this.product.findMany({ skip: (page - 1) * limit, take: limit }),
      meta: { page: page, total: totalPages, totalPages: Math.ceil(totalPages / limit) }
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({ where: { id, available: true} });
    if (!product) throw new NotFoundException(`Product with id: ${id} not found`);
    return 
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
}
