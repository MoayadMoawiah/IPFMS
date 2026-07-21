"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementModule = void 0;
const common_1 = require("@nestjs/common");
const requisitions_controller_1 = require("./requisitions/requisitions.controller");
const requisitions_service_1 = require("./requisitions/requisitions.service");
const vendors_controller_1 = require("./vendors/vendors.controller");
const vendors_service_1 = require("./vendors/vendors.service");
const rfq_controller_1 = require("./rfq/rfq.controller");
const rfq_service_1 = require("./rfq/rfq.service");
const purchase_orders_controller_1 = require("./purchase-orders/purchase-orders.controller");
const purchase_orders_service_1 = require("./purchase-orders/purchase-orders.service");
const goods_receipt_controller_1 = require("./goods-receipt/goods-receipt.controller");
const goods_receipt_service_1 = require("./goods-receipt/goods-receipt.service");
const contracts_controller_1 = require("./contracts/contracts.controller");
const contracts_service_1 = require("./contracts/contracts.service");
const paf_controller_1 = require("./paf/paf.controller");
const paf_service_1 = require("./paf/paf.service");
const vendor_invoices_controller_1 = require("./vendor-invoices/vendor-invoices.controller");
const vendor_invoices_service_1 = require("./vendor-invoices/vendor-invoices.service");
const grants_module_1 = require("../grants/grants.module");
const uploads_module_1 = require("../uploads/uploads.module");
let ProcurementModule = class ProcurementModule {
};
exports.ProcurementModule = ProcurementModule;
exports.ProcurementModule = ProcurementModule = __decorate([
    (0, common_1.Module)({
        imports: [grants_module_1.GrantsModule, uploads_module_1.UploadsModule],
        controllers: [
            requisitions_controller_1.RequisitionsController,
            vendors_controller_1.VendorsController,
            rfq_controller_1.RfqController,
            purchase_orders_controller_1.PurchaseOrdersController,
            goods_receipt_controller_1.GoodsReceiptController,
            contracts_controller_1.ContractsController,
            paf_controller_1.PafController,
            vendor_invoices_controller_1.VendorInvoicesController,
        ],
        providers: [
            requisitions_service_1.RequisitionsService,
            vendors_service_1.VendorsService,
            rfq_service_1.RfqService,
            purchase_orders_service_1.PurchaseOrdersService,
            goods_receipt_service_1.GoodsReceiptService,
            contracts_service_1.ContractsService,
            paf_service_1.PafService,
            vendor_invoices_service_1.VendorInvoicesService,
        ],
        exports: [purchase_orders_service_1.PurchaseOrdersService, goods_receipt_service_1.GoodsReceiptService, vendor_invoices_service_1.VendorInvoicesService],
    })
], ProcurementModule);
//# sourceMappingURL=procurement.module.js.map