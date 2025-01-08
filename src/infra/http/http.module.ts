import { Module } from '@nestjs/common';
import { PokemonsAdapter } from './adapters/pokemons/pokemons.adapter';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [PokemonsAdapter],
  exports: [PokemonsAdapter],
})
export class HttpModule {}
