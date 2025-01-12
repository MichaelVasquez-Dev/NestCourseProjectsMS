import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private products;
    create(createProductDto: CreateProductDto): Product;
    findAll(): Product[];
    findOne(id: string): Product;
    update(id: string, updateProductDto: UpdateProductDto): Product;
    remove(id: string): Product[];
}
