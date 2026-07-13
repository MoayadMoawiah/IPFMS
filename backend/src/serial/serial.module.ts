import { Global, Module } from '@nestjs/common';
import { SerialService } from './serial.service';
import { SerialController } from './serial.controller';

@Global()
@Module({
  controllers: [SerialController],
  providers: [SerialService],
  exports: [SerialService],
})
export class SerialModule {}
