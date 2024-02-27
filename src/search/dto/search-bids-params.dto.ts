import { IsDateString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SearchBidsParamsDto {
  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  @IsInt({ each: true })
  @Min(0)
  @Max(4)
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
