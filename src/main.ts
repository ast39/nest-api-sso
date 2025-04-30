import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/HttpException.filter';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
	dotenv.config();
	const app = await NestFactory.create(AppModule);
	const APP_PORT = process.env.APP_PORT || 3000;
	const SWAGGER_PREFIX = process.env.API_PREFIX + process.env.SWAGGER_PATH;

	app.setGlobalPrefix(process.env.API_PREFIX);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: false },
		}),
	);
	app.useGlobalFilters(new HttpExceptionFilter());

	app.enableCors({
		origin: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		credentials: true,
	});

	const docs = new DocumentBuilder()
		.setTitle(process.env.APP_TITLE || 'API')
		.setDescription(process.env.APP_DESC || 'Описание методов API')
		.setVersion(process.env.APP_VERSION || '1.0.0')
		.addBearerAuth()
		.setContact('Alexandr St.', 'https://t.me/ASt39', 'alexandr.statut@gmail.com')
		.setExternalDoc('API Docs', 'http://localhost:3003/api/v1/docs-json')
		.addServer(process.env.APP_URL || 'http://localhost:3003', 'Api Server')
		.build();

	const document = SwaggerModule.createDocument(app, docs);
	SwaggerModule.setup(SWAGGER_PREFIX, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			docExpansion: 'none',
			filter: true,
			tagsSorter: 'method',
			operationsSorter: 'alpha',
		},
	});

	await app.listen(APP_PORT, () => console.log(`APP started on port ${APP_PORT}`));
}

bootstrap();
