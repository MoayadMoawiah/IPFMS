"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const chart_of_accounts_controller_1 = require("./chart-of-accounts/chart-of-accounts.controller");
const chart_of_accounts_service_1 = require("./chart-of-accounts/chart-of-accounts.service");
const journal_entries_controller_1 = require("./journal-entries/journal-entries.controller");
const journal_entries_service_1 = require("./journal-entries/journal-entries.service");
const payments_controller_1 = require("./payments/payments.controller");
const payments_service_1 = require("./payments/payments.service");
const uploads_module_1 = require("../uploads/uploads.module");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [uploads_module_1.UploadsModule],
        controllers: [chart_of_accounts_controller_1.ChartOfAccountsController, journal_entries_controller_1.JournalEntriesController, payments_controller_1.PaymentsController],
        providers: [chart_of_accounts_service_1.ChartOfAccountsService, journal_entries_service_1.JournalEntriesService, payments_service_1.PaymentsService],
        exports: [journal_entries_service_1.JournalEntriesService, payments_service_1.PaymentsService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map