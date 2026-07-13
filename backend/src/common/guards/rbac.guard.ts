import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RbacService } from '../../rbac/rbac.service';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No permissions required → allow
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user has ALL required permissions
    const hasPermissions = await this.rbacService.userHasPermissions(
      user.id,
      requiredPermissions,
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
