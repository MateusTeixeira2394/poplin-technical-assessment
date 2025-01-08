import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Trainer } from '../../infra/database/entities/trainer.entity';
import { FindOnePokemonAdapterDto } from '../../infra/http/adapters/pokemons/dtos/find-one-pokemon-adapter.dto';
import { PokemonsAdapter } from '../../infra/http/adapters/pokemons/pokemons.adapter';
import { CreateTrainerDto } from './dtos/create-trainer-dto';
import { PatchTrainerDto } from './dtos/patch-trainer.dto';
import { TrainersService } from './trainers.service';

jest.mock('../../infra/database/data-source', () => ({
  dataSource: {
    getRepository: jest.fn(() => ({
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    })),
  },
}));

describe('TrainersService', () => {
  let service: TrainersService;
  let repository: Repository<Trainer>;
  let pokemonsAdapter: PokemonsAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainersService,
        {
          provide: PokemonsAdapter,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrainersService>(TrainersService);
    repository = service['repository'];
    pokemonsAdapter = module.get<PokemonsAdapter>(PokemonsAdapter);
  });

  describe(`${TrainersService.prototype.create.name}`, () => {
    it('should create a new trainer', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: [],
      };
      const dto: CreateTrainerDto = { firstName: 'Ash', lastName: 'Ketchum' };

      jest.spyOn(repository, 'save').mockResolvedValue(mockTrainer);

      const result = await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        pokemons: [],
      });
    });
  });

  describe(`${TrainersService.prototype.findMany.name}`, () => {
    it('should return a paginated list of trainers', async () => {
      const mockTrainers = [
        {
          id: 1,
          firstName: 'Ash',
          lastName: 'Ketchum',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          pokeballs: [],
        },
        {
          id: 2,
          firstName: 'Misty',
          lastName: 'Waterflower',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          pokeballs: [],
        },
      ];

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mockTrainers, 2]);

      const result = await service.findMany(1, 10);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { id: 'ASC' },
      });

      expect(result).toEqual({
        total: 2,
        totalPages: 1,
        data: expect.any(Array),
      });
    });
  });

  describe(`${TrainersService.prototype.findOne.name}`, () => {
    it('should return a trainer and their pokemons', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: [{ id: 1 }],
      } as Trainer;
      const mockPokemon: FindOnePokemonAdapterDto = {
        id: 1,
        name: 'Pikachu',
        height: 4,
        weight: 60,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTrainer);
      jest.spyOn(pokemonsAdapter, 'findOne').mockResolvedValue(mockPokemon);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pokeballs'],
      });
      expect(pokemonsAdapter.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        pokemons: [expect.any(Object)],
      });
    });

    it('should throw if trainer not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('Trainer not found');
    });
  });

  describe(`${TrainersService.prototype.patch.name}`, () => {
    it('should update a trainer', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: [],
      };
      const dto: PatchTrainerDto = { firstName: 'Ash Updated' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTrainer);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockTrainer,
        ...dto,
      });

      const result = await service.patch(1, dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        withDeleted: true,
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockTrainer,
        ...dto,
      });
      expect(result).toEqual({
        id: 1,
        firstName: 'Ash Updated',
        lastName: 'Ketchum',
      });
    });

    it('should throw if trainer not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.patch(1, { firstName: 'Ash Updated' }),
      ).rejects.toThrow('Trainer not found');
    });
  });

  describe(`${TrainersService.prototype.delete.name}`, () => {
    it('should soft-delete a trainer', async () => {
      const mockTrainer = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        pokeballs: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTrainer);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockTrainer,
        deletedAt: new Date(),
      });

      await service.delete(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockTrainer,
        deletedAt: expect.any(Date),
      });
    });

    it('should throw if trainer not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow('Trainer not found');
    });
  });
});
