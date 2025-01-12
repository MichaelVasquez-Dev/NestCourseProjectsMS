"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor() {
        this.products = [
            { id: 'dd65bab6-cb77-4116-b064-109db18c22cc', name: 'Pera', description: 'Fruta de color verde', price: 2000 },
            { id: '7decd2cc-a67c-4a93-b22f-36f123b14c29', name: 'Uvas', description: 'Fruta de color rojo', price: 3000 },
            { id: 'ae450860-a987-4ae2-a0a4-2d1e8fd9bdf2', name: 'Banano', description: 'Fruta de color amarillo', price: 1000 },
            { id: '9acd168d-c3b0-4899-80db-f79b66fe389a', name: 'naranja', description: 'Fruta de color naranja', price: 1500 }
        ];
    }
    create(createProductDto) {
        const { name, description, price } = createProductDto;
        const newProduct = new product_entity_1.Product((0, uuid_1.v4)(), name, description, price);
        this.products.push(newProduct);
        return newProduct;
    }
    findAll() {
        return this.products;
    }
    findOne(id) {
        const product = this.products.find(product => product.id === id);
        if (!product)
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        return product;
    }
    update(id, updateProductDto) {
        const { id: _, ...values } = updateProductDto;
        const product = this.findOne(id);
        Object.assign(product, values);
        return product;
    }
    remove(id) {
        this.findOne(id);
        return this.products = this.products.filter(product => product.id !== id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map