import { Expose } from 'class-transformer';
import { FindManyPokemonDto } from './find-many-pokemon.dto';

export class FindOnePokemonDto extends FindManyPokemonDto {
  @Expose()
  height: number;

  @Expose()
  weight: number;
}
