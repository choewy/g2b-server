import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('lambda')
@Controller('lambda')
export class LambdaController {}
