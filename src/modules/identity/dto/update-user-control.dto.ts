import { PartialType } from '@nestjs/swagger';
import { CreateUserControlDto } from './create-user-control.dto';

export class UpdateUserControlDto extends PartialType(CreateUserControlDto) {}
