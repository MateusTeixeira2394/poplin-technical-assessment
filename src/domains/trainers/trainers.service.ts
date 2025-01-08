import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { dataSource } from '../../infra/database/data-source';
import { Trainer } from '../../infra/database/entities/trainer.entity';
import { FindOnePokemonAdapterDto } from '../../infra/http/adapters/pokemons/dtos/find-one-pokemon-adapter.dto';
import { PokemonsAdapter } from '../../infra/http/adapters/pokemons/pokemons.adapter';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { FindOnePokemonDto } from '../pokemons/dtos/find-one-pokemon.dto';
import { CreateTrainerDto } from './dtos/create-trainer-dto';
import { FindManyTrainerDto } from './dtos/find-many-trainer.dto';
import { FindOneTrainerDto } from './dtos/find-one-trainer.dto';
import { PatchTrainerDto } from './dtos/patch-trainer.dto';

@Injectable()
export class TrainersService {
  private repository: Repository<Trainer>;

  constructor(private pokemonsAdapter: PokemonsAdapter) {
    this.repository = dataSource.getRepository(Trainer);
  }

  public async create({
    firstName,
    lastName,
  }: CreateTrainerDto): Promise<FindOneTrainerDto> {
    try {
      const trainer = await this.repository.save({ firstName, lastName });

      return plainToInstance(
        FindOneTrainerDto,
        { ...trainer, pokemons: [] },
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  public async findMany(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationDto<FindManyTrainerDto>> {
    const [trainers, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    const totalPages: number = Math.ceil(total / limit);

    return {
      total,
      totalPages,
      data: trainers.map((trainer) =>
        plainToInstance(FindManyTrainerDto, trainer, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        }),
      ),
    };
  }

  public async findOne(trainerId: number): Promise<FindOneTrainerDto> {
    try {
      const trainer = await this.repository.findOne({
        where: { id: trainerId },
        relations: ['pokeballs'],
      });

      if (!trainer) throw new BadRequestException('Trainer not found');

      const { id, firstName, lastName, pokeballs } = trainer;

      const promises = pokeballs.map((pkm) =>
        this.pokemonsAdapter.findOne(pkm.id),
      );

      const pokemons: FindOnePokemonAdapterDto[] = await Promise.all(promises);

      return {
        id,
        firstName,
        lastName,
        pokemons: pokemons.map((pkm) =>
          plainToInstance(FindOnePokemonDto, pkm, {
            excludeExtraneousValues: true,
          }),
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  private update(
    { firstName, lastName, restore }: PatchTrainerDto,
    trainer: Trainer,
  ): void {
    if (firstName) {
      trainer.firstName = firstName;
    }

    if (lastName) {
      trainer.lastName = lastName;
    }

    if (restore) {
      trainer.deletedAt = null;
    }
  }

  public async patch(
    id: number,
    body: PatchTrainerDto,
  ): Promise<FindManyTrainerDto> {
    const trainer = await this.repository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!trainer) throw new BadRequestException('Trainer not found');

    this.update(body, trainer);

    await this.repository.save(trainer);

    return plainToInstance(FindManyTrainerDto, trainer, {
      excludeExtraneousValues: true,
    });
  }

  public async delete(id: number): Promise<void> {
    const trainer = await this.repository.findOne({
      where: { id },
    });

    if (!trainer) throw new BadRequestException('Trainer not found');

    trainer.deletedAt = new Date();

    await this.repository.save(trainer);
  }
}
