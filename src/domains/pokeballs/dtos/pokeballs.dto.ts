import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PokeballDto {
  @ApiProperty({
    description: "Pokeball's id",
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "Pokemon's id",
  })
  @Expose()
  pokemonId: number;

  @ApiProperty({
    description: "Trainer's id",
  })
  @Expose()
  trainerId: number;
}
