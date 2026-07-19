import { Module } from '@nestjs/common';
import { RequisitionsController } from './requisitions/requisitions.controller';
import { RequisitionsService } from './requisitions/requisitions.service';
import { VendorsController } from './vendors/vendors.controller';
import { VendorsService } from './vendors/vendors.service';
import { RfqController } from './rfq/rfq.controller';
import { RfqService } from './rfq/rfq.service';
import { PurchaseOrdersController } from './purchase-orders/purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders/purchase-orders.service';
import { GoodsReceiptController } from './goods-receipt/goods-receipt.controller';
import { GoodsReceiptService } from './goods-receipt/goods-receipt.service';
import { ContractsController } from './contracts/contracts.controller';
import { ContractsService } from './contracts/contracts.service';
import { PafController } from './paf/paf.controller';
import { PafService } from './paf/paf.service';
import { GrantsModule } from '../grants/grants.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [GrantsModule, UploadsModule],
  controllers: [
    RequisitionsController,
    VendorsController,
    RfqController,
    PurchaseOrdersController,
    GoodsReceiptController,
    ContractsController,
    PafController,
  ],
  providers: [
    RequisitionsService,
    VendorsService,
    RfqService,
    PurchaseOrdersService,
    GoodsReceiptService,
    ContractsService,
    PafService,
  ],
  exports: [PurchaseOrdersService, GoodsReceiptService],
})
export class ProcurementModule {}
