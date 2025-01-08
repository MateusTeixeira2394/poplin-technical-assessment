import { FindManyPokemonsAdatperDto } from './dtos/find-many-pokemons-adapter.dto';
import { FindOnePokemonAdapterDto } from './dtos/find-one-pokemon-adapter.dto';

export interface PokemonPort {
  findMany: (
    offset: number,
    limit: number,
  ) => Promise<FindManyPokemonsAdatperDto>;

  findOne: (id: number) => Promise<FindOnePokemonAdapterDto>;
}
