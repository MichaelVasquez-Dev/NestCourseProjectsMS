import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid'
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private products: Product[] = [
    {id: 'dd65bab6-cb77-4116-b064-109db18c22cc', name: 'Pera', description: 'Fruta de color verde', price: 2000},
    {id: '7decd2cc-a67c-4a93-b22f-36f123b14c29', name: 'Uvas', description: 'Fruta de color rojo', price: 3000},
    {id: 'ae450860-a987-4ae2-a0a4-2d1e8fd9bdf2', name: 'Banano', description: 'Fruta de color amarillo', price: 1000},
    {id: '9acd168d-c3b0-4899-80db-f79b66fe389a', name: 'naranja', description: 'Fruta de color naranja', price: 1500}
  ]

  create(createProductDto: CreateProductDto) {
    const { name, description, price } = createProductDto;
    const newProduct = new Product(uuid(), name, description, price);
    this.products.push(newProduct);

    return newProduct;
  }

  findAll() {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find(product => product.id === id);
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { id:_, ...values } = updateProductDto;
    const product = this.findOne(id);
    Object.assign(product, values);
    return product;
  }

  remove(id: string) {
    this.findOne(id);
    return this.products = this.products.filter(product => product.id !== id);
  }
}
