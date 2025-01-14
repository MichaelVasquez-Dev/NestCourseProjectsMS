import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICES } from 'config/service';
import { envs } from 'config/envs';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
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
  ]
})
export class OrdersModule {}
