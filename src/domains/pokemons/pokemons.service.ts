import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PokemonsAdapter } from '../../infra/http/adapters/pokemons/pokemons.adapter';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { FindManyPokemonDto } from './dtos/find-many-pokemon.dto';
import { FindOnePokemonDto } from './dtos/find-one-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(private pokemonsAdapter: PokemonsAdapter) {}

  private extractId(url: string): number {
    const regex = /\/(\d+)\/?$/;
    const match = url.match(regex);
    if (!match)
      throw new InternalServerErrorException('Incompatible pokemon url');
    return parseInt(match[1]);
  }

  public async findMany(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationDto<FindManyPokemonDto>> {
    try {
      const { count, results } = await this.pokemonsAdapter.findMany(
        (page - 1) * limit,
        limit,
      );

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        data: results.map((pokemon) => ({
          name: pokemon.name,
          id: this.extractId(pokemon.url),
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<FindOnePokemonDto> {
    try {
      const adapterResp = await this.pokemonsAdapter.findOne(id);

      return plainToInstance(FindOnePokemonDto, adapterResp, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
