import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICES } from 'config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: PRODUCT_SERVICES, 
        transport: Transport.TCP,
        options: {
          host: envs.productsMSHost,
          port: envs.productsMSPort
        }
      },
    ]),
  ],
})
export class ProductsModule {}
