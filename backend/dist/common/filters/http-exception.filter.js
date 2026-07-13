"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = [];
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse;
                message = resp.message || exception.message;
                if (Array.isArray(resp.message)) {
                    errors = resp.message.map((msg) => ({ message: msg }));
                    message = 'Validation failed';
                }
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002':
                    status = common_1.HttpStatus.CONFLICT;
                    message = `A record with this ${exception.meta?.target?.join(', ')} already exists`;
                    break;
                case 'P2025':
                    status = common_1.HttpStatus.NOT_FOUND;
                    message = 'Record not found';
                    break;
                case 'P2003':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = 'Related record not found';
                    break;
                default:
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = 'Database error';
                    this.logger.error(`Prisma error ${exception.code}: ${exception.message}`);
            }
        }
        else if (exception instanceof Error) {
            this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
            message = exception.message;
        }
        const errorResponse = {
            statusCode: status,
            message,
            ...(errors.length > 0 && { errors }),
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        if (status >= 500) {
            this.logger.error(`[${request.method}] ${request.url} → ${status}: ${message}`, exception instanceof Error ? exception.stack : undefined);
        }
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map