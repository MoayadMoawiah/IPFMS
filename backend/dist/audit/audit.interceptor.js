"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = exports.Audit = exports.AUDIT_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
exports.AUDIT_KEY = 'audit';
const Audit = (meta) => {
    const { SetMetadata } = require('@nestjs/common');
    return SetMetadata(exports.AUDIT_KEY, meta);
};
exports.Audit = Audit;
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService, reflector) {
        this.auditService = auditService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const auditMeta = this.reflector.getAllAndOverride(exports.AUDIT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!auditMeta)
            return next.handle();
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseData) => {
                const duration = Date.now() - start;
                const resourceId = request.params?.id || responseData?.data?.id || responseData?.id;
                this.auditService
                    .log({
                    userId: user?.id,
                    userEmail: user?.email,
                    action: auditMeta.action,
                    module: auditMeta.module,
                    resource: auditMeta.resource,
                    resourceId,
                    newValues: ['POST', 'PATCH', 'PUT'].includes(request.method) ? request.body : undefined,
                    ipAddress: request.ip,
                    userAgent: request.headers['user-agent'],
                    duration,
                })
                    .catch(() => { });
            },
            error: () => {
                const duration = Date.now() - start;
                this.auditService
                    .log({
                    userId: user?.id,
                    userEmail: user?.email,
                    action: auditMeta.action,
                    module: auditMeta.module,
                    resource: auditMeta.resource,
                    ipAddress: request.ip,
                    userAgent: request.headers['user-agent'],
                    duration,
                })
                    .catch(() => { });
            },
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        core_1.Reflector])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map