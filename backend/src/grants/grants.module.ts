import { Module } from '@nestjs/common';
import { GrantsController } from './grants.controller';
import { GrantsService } from './grants.service';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [GrantsController, DonorsController],
  providers: [GrantsService, DonorsService],
  exports: [GrantsService],
})
export class GrantsModule {}
