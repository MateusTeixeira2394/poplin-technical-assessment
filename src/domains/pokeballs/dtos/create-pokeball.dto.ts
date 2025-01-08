import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePokeballDto {
  @ApiProperty({
    description: `The pokemon id`,
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  pokemonId: number;

  @ApiProperty({
    description: `The trainer id`,
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  trainerId: number;
}
