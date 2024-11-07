import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Роль не найдена' }, HttpStatus.NOT_FOUND);
	}
}

export class BadRoleException extends HttpException {
	constructor() {
		super({ message: 'Указана несуществующая роль' }, HttpStatus.BAD_REQUEST);
	}
}

export class RoleDoubleException extends HttpException {
	constructor() {
		super({ message: 'Роль должна быть уникальна' }, HttpStatus.BAD_REQUEST);
	}
}
