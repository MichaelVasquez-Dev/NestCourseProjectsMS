import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost) {
    // return throwError(() => exception.getError());

    const ctx = host.switchToHttp();
    const respose = ctx.getResponse();
    const rpcError = exception.getError();

    if( typeof rpcError === 'object' && "status" in rpcError && "message" in rpcError ) {
      return respose.status(rpcError.status).json({ message: rpcError });
    }

    return respose.status(400).json({ message: rpcError });
  }

}