import { Module } from '@nestjs/common';
import { IsRootGuard } from '../auth/guards/is-root-guard';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { RoleValidation } from './validation/role.validation';

@Module({
	imports: [],
	controllers: [RoleController],
	providers: [RoleService, RoleRepository, RoleValidation, IsRootGuard],
	exports: [RoleService, RoleRepository, RoleValidation],
})
export class RoleModule {}
