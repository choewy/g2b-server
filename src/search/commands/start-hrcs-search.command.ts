import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, Max, Min } from 'class-validator';

export class StartHrcsSearchCommand {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(3, { each: true })
  types: number[];

  @ApiProperty({ type: String, format: 'date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsDateString()
  endDate: string;
}
