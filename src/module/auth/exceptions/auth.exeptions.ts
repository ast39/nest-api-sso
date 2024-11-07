import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongAuthDataException extends HttpException {
	constructor() {
		super({ message: 'Неверные логин или пароль' }, HttpStatus.UNAUTHORIZED);
	}
}

export class UserWasBlockedException extends HttpException {
	constructor() {
		super({ message: 'Пользователь заблокирован' }, HttpStatus.UNAUTHORIZED);
	}
}

export class NotAccessException extends HttpException {
	constructor() {
		super({ message: 'Недостаточно прав для данного действия' }, HttpStatus.UNAUTHORIZED);
	}
}

export class TokenIsAbsentException extends HttpException {
	constructor() {
		super({ message: 'Токен не был передан' }, HttpStatus.UNAUTHORIZED);
	}
}

export class TokenExpireException extends HttpException {
	constructor() {
		super({ message: 'Токен просрочен' }, HttpStatus.UNAUTHORIZED);
	}
}

export class BruteForceException extends HttpException {
	constructor() {
		super({ message: 'Превышено кол-во попыток авторизации. Повторите попытку позже.' }, HttpStatus.UNAUTHORIZED);
	}
}
