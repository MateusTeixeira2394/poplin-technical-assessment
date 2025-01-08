import { BadRequestException, Injectable } from '@nestjs/common';
import { dataSource } from '../../infra/database/data-source';
import { Pokeball } from '../../infra/database/entities/pokeball.entity';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PokeballDto } from './dtos/pokeballs.dto';
import { Trainer } from '../../infra/database/entities/trainer.entity';
import { PokemonsAdapter } from '../../infra/http/adapters/pokemons/pokemons.adapter';

@Injectable()
export class PokeballsService {
  private repository: Repository<Pokeball>;
  private trainerRepo: Repository<Trainer>;

  constructor(private pokemonAdapter: PokemonsAdapter) {
    this.repository = dataSource.getRepository(Pokeball);
    this.trainerRepo = dataSource.getRepository(Trainer);
  }

  private getFilters(
    pokemonId?: number,
    trainerId?: number,
  ): FindOptionsWhere<Pokeball> {
    let where: FindOptionsWhere<Pokeball> = {};

    if (pokemonId) {
      where.pokemonId = pokemonId;
    }

    if (trainerId) {
      where.trainer = { id: trainerId };
    }

    return where;
  }

  public async findMany(
    page: number = 1,
    limit: number = 20,
    pokemonId?: number,
    trainerId?: number,
  ): Promise<PaginationDto<PokeballDto>> {
    const where = this.getFilters(pokemonId, trainerId);

    const [pokeballs, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['trainer'],
      order: { id: 'ASC' },
      where,
    });

    const totalPages: number = Math.ceil(total / limit);

    return {
      total,
      totalPages,
      data: pokeballs.map<PokeballDto>(({ id, pokemonId, trainer }) => ({
        id,
        pokemonId,
        trainerId: trainer.id,
      })),
    };
  }

  public async create(
    pokemonId: number,
    trainerId: number,
  ): Promise<PokeballDto> {
    try {
      const [_pokemon, trainer] = await Promise.all([
        this.pokemonAdapter.findOne(pokemonId),
        this.trainerRepo.findOne({
          where: { id: trainerId },
          relations: ['pokeballs'],
        }),
      ]);

      if (!trainer) throw new BadRequestException('Trainer not found');
      if (trainer.pokeballs.length >= 6)
        throw new BadRequestException(
          'A trainer cannot have more than 6 pokeballs',
        );

      const { id } = await this.repository.save({ pokemonId, trainer });

      return {
        id,
        pokemonId,
        trainerId,
      };
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const pokeball = await this.repository.findOneBy({ id });

      if (!pokeball) throw new BadRequestException('Pokeball not found');

      await this.repository.delete(pokeball);
    } catch (error) {
      throw error;
    }
  }
}
