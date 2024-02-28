import { IsArray, IsDateString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SearchHrcsParamsDto {
  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(3, { each: true })
  types: number[];

  @ApiProperty({ type: String, format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
