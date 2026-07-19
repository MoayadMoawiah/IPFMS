import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Binary/file responses must not be wrapped as { data: ... }
        if (data instanceof StreamableFile) {
          return data;
        }
        // If already has a 'data' wrapper or is a pagination response, pass through
        if (data && typeof data === 'object' && ('data' in data || 'meta' in data)) {
          return data;
        }
        return { data };
      }),
    );
  }
}
