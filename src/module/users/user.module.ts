import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserValidation } from './validation/user.validation';
import { IsRootGuard } from '../auth/guards/is-root-guard';

@Module({
	imports: [],
	controllers: [UserController],
	providers: [UserService, UserRepository, UserValidation, IsRootGuard],
	exports: [UserService, UserRepository, UserValidation],
})
export class UserModule {}
