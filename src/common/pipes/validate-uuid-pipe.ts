import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string> {
	transform(value: string, metadata: ArgumentMetadata): string {
		if (!uuidValidate(value)) {
			throw new BadRequestException(`${metadata.data} must be a valid UUID`);
		}
		return value;
	}
}
