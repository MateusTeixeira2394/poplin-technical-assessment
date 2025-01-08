import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisAdapter } from '../../../cache/redis.adapter';
import { FindManyPokemonsAdatperDto } from './dtos/find-many-pokemons-adapter.dto';
import { FindOnePokemonAdapterDto } from './dtos/find-one-pokemon-adapter.dto';
import { PokemonPort } from './pokemon.port';

@Injectable()
export class PokemonsAdapter implements PokemonPort {
  private pokemon_api: string;
  private readonly POKEMON_ENDPOINT = '/pokemon';

  constructor(
    private configService: ConfigService,
    private redisAdapter: RedisAdapter,
  ) {
    this.pokemon_api = this.configService.get<string>('pokemon_api');
  }

  public async findMany(
    offset: number,
    limit: number,
  ): Promise<FindManyPokemonsAdatperDto> {
    try {
      const key: string = `pokemons:${offset}:${limit}`;
      const cached: string = await this.redisAdapter.get(key);

      if (cached) {
        return JSON.parse(cached);
      }

      const { data } = await axios.get<FindManyPokemonsAdatperDto>(
        this.pokemon_api + this.POKEMON_ENDPOINT,
        { params: { offset, limit } },
      );

      this.redisAdapter.set(key, JSON.stringify(data));

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<FindOnePokemonAdapterDto> {
    try {
      const key: string = `pokemon:${id}`;
      const cached: string = await this.redisAdapter.get(key);

      if (cached) {
        return JSON.parse(cached);
      }

      const { data } = await axios.get<FindOnePokemonAdapterDto>(
        `${this.pokemon_api}${this.POKEMON_ENDPOINT}/${id}`,
      );

      this.redisAdapter.set(key, JSON.stringify(data));

      return data;
    } catch (error) {
      throw new NotFoundException(`Pokemon of id ${id} not found`);
    }
  }
}
