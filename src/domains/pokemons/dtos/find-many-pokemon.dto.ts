import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FindManyPokemonDto {
  @ApiProperty({
    description: "Pokemon's id",
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "Pokemon's name",
  })
  @Expose()
  name: string;
}
