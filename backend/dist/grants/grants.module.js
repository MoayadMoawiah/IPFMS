"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantsModule = void 0;
const common_1 = require("@nestjs/common");
const grants_controller_1 = require("./grants.controller");
const grants_service_1 = require("./grants.service");
const donors_controller_1 = require("./donors.controller");
const donors_service_1 = require("./donors.service");
const uploads_module_1 = require("../uploads/uploads.module");
let GrantsModule = class GrantsModule {
};
exports.GrantsModule = GrantsModule;
exports.GrantsModule = GrantsModule = __decorate([
    (0, common_1.Module)({
        imports: [uploads_module_1.UploadsModule],
        controllers: [grants_controller_1.GrantsController, donors_controller_1.DonorsController],
        providers: [grants_service_1.GrantsService, donors_service_1.DonorsService],
        exports: [grants_service_1.GrantsService],
    })
], GrantsModule);
//# sourceMappingURL=grants.module.js.map