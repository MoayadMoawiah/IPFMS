"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFQ_MIN_AMOUNT_USD = void 0;
exports.resolveProcurementRoute = resolveProcurementRoute;
exports.RFQ_MIN_AMOUNT_USD = 1001;
function resolveProcurementRoute(totalEstimatedAmount) {
    return totalEstimatedAmount > exports.RFQ_MIN_AMOUNT_USD ? 'RFQ' : 'DIRECT_PO';
}
//# sourceMappingURL=procurement.constants.js.map