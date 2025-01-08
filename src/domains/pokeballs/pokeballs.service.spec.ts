import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PokeballsService } from './pokeballs.service';
import { PokemonsAdapter } from '../../infra/http/adapters/pokemons/pokemons.adapter';
import { Pokeball } from '../../infra/database/entities/pokeball.entity';
import { Trainer } from '../../infra/database/entities/trainer.entity';
import { FindOnePokemonAdapterDto } from 'src/infra/http/adapters/pokemons/dtos/find-one-pokemon-adapter.dto';

jest.mock('../../infra/database/data-source', () => ({
  dataSource: {
    getRepository: jest.fn(() => ({
      findAndCount: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    })),
  },
}));

describe('PokeballsService', () => {
  let service: PokeballsService;
  let pokeballRepository: Repository<Pokeball>;
  let trainerRepository: Repository<Trainer>;
  let pokemonAdapter: PokemonsAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokeballsService,
        {
          provide: PokemonsAdapter,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokeballsService>(PokeballsService);
    pokemonAdapter = module.get<PokemonsAdapter>(PokemonsAdapter);
    pokeballRepository = service['repository'];
    trainerRepository = service['trainerRepo'];
  });

  describe(`${PokeballsService.prototype.findMany.name}`, () => {
    it('should return paginated pokeballs', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: [],
      };

      const mockPokeballs = [
        { id: 1, pokemonId: 1, trainer: mockTrainer },
        { id: 2, pokemonId: 2, trainer: mockTrainer },
      ];

      jest
        .spyOn(pokeballRepository, 'findAndCount')
        .mockResolvedValue([mockPokeballs, 2]);

      const result = await service.findMany(1, 10);

      expect(result).toEqual({
        total: 2,
        totalPages: 1,
        data: [
          { id: 1, pokemonId: 1, trainerId: 1 },
          { id: 2, pokemonId: 2, trainerId: 1 },
        ],
      });
    });
  });

  describe(`${PokeballsService.prototype.create.name}`, () => {
    it('should create a new pokeball', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: [],
      };

      const mockPokemon: FindOnePokemonAdapterDto = {
        id: 1,
        name: 'Pikachu',
        height: 4,
        weight: 60,
      };

      jest.spyOn(pokemonAdapter, 'findOne').mockResolvedValue(mockPokemon);
      jest.spyOn(trainerRepository, 'findOne').mockResolvedValue(mockTrainer);
      jest.spyOn(pokeballRepository, 'save').mockResolvedValue({
        id: 1,
        pokemonId: 1,
        trainer: mockTrainer,
      });

      const result = await service.create(1, 1);

      expect(result).toEqual({ id: 1, pokemonId: 1, trainerId: 1 });
    });

    it('should throw if trainer is not found', async () => {
      jest.spyOn(trainerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw if trainer has more than 6 pokeballs', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: new Array(6),
      };

      jest.spyOn(trainerRepository, 'findOne').mockResolvedValue(mockTrainer);

      await expect(service.create(1, 1)).rejects.toThrow(
        'A trainer cannot have more than 6 pokeballs',
      );
    });
  });

  describe(`${PokeballsService.prototype.delete.name}`, () => {
    it('should delete a pokeball', async () => {
      const mockPokeball: Pokeball = {
        id: 1,
        pokemonId: 1,
        trainer: {
          id: 1,
          firstName: 'Ash',
          lastName: 'Ketchum',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          pokeballs: new Array(6),
        },
      };

      jest
        .spyOn(pokeballRepository, 'findOneBy')
        .mockResolvedValue(mockPokeball);
      jest.spyOn(pokeballRepository, 'delete').mockResolvedValue(undefined);

      await service.delete(1);

      expect(pokeballRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(pokeballRepository.delete).toHaveBeenCalledWith(mockPokeball);
    });

    it('should throw if pokeball is not found', async () => {
      jest.spyOn(pokeballRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow('Pokeball not found');
    });
  });
});
