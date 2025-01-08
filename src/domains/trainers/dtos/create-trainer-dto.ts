import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTrainerDto {
  @ApiProperty({
    description: `The trainer first name`,
    minLength: 3,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @ApiProperty({
    description: `The trainer last name`,
    minLength: 3,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;
}
