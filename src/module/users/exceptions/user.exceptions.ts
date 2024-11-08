import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Пользователь не найден' }, HttpStatus.NOT_FOUND);
	}
}

export class BadUserException extends HttpException {
	constructor() {
		super({ message: 'Указан несуществующий пользователь' }, HttpStatus.BAD_REQUEST);
	}
}

export class UserDoubleException extends HttpException {
	constructor() {
		super({ message: 'Пользователь должен быть уникален' }, HttpStatus.BAD_REQUEST);
	}
}

export class RootUserException extends HttpException {
	constructor() {
		super({ message: 'Нельзя изменить Root пользователя' }, HttpStatus.BAD_REQUEST);
	}
}
