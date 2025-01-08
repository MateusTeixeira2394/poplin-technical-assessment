import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class PatchTrainerDto {
  @ApiProperty({
    description: `The trainer first name`,
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  firstName?: string;

  @ApiProperty({
    description: `The trainer last name`,
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  lastName?: string;

  @ApiProperty({
    description: `Restore deleted trainers`,
    required: false,
  })
  @IsOptional()
  restore?: boolean;
}
