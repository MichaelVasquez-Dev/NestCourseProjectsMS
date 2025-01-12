import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): import("./entities/product.entity").Product;
    findAll(): import("./entities/product.entity").Product[];
    findOne(id: string): import("./entities/product.entity").Product;
    update(id: string, updateProductDto: UpdateProductDto): import("./entities/product.entity").Product;
    remove(id: string): import("./entities/product.entity").Product[];
}
