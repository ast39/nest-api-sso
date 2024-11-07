import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
	constructor(objectOrError: object) {
		super(objectOrError, HttpStatus.UNPROCESSABLE_ENTITY);
	}
}

export class NeedAuthException extends HttpException {
	constructor() {
		super({ message: 'Требуется авторизация' }, HttpStatus.UNAUTHORIZED);
	}
}

export class NoTokenFoundException extends HttpException {
	constructor() {
		super({ message: 'Авторизационный токен не найден' }, HttpStatus.UNAUTHORIZED);
	}
}

export class TokenNotValidException extends HttpException {
	constructor() {
		super({ message: 'Авторизационный токен невалиден' }, HttpStatus.UNAUTHORIZED);
	}
}

export class BadRequestException extends HttpException {
	constructor(code: string | number) {
		super({ message: 'Сервер вернул ошибку, статус ' + code }, HttpStatus.BAD_REQUEST);
	}
}
