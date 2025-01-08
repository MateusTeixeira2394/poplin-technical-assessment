import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsAdapter } from '../../infra/http/adapters/pokemons/pokemons.adapter';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { FindOnePokemonDto } from './dtos/find-one-pokemon.dto';

describe('PokemonsService', () => {
  let service: PokemonsService;
  let pokemonsAdapter: PokemonsAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonsService,
        {
          provide: PokemonsAdapter,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
    pokemonsAdapter = module.get<PokemonsAdapter>(PokemonsAdapter);
  });

  describe('extractId', () => {
    it('should extract ID from a valid URL', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/1/';
      const result = (service as any).extractId(url); // Accessing private method for testing
      expect(result).toBe(1);
    });

    it('should throw an error if URL is invalid', () => {
      const url = 'invalid-url';
      expect(() => (service as any).extractId(url)).toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe(`${PokemonsService.prototype.findMany.name}`, () => {
    it('should return a paginated list of pokemons', async () => {
      const mockResponse = {
        count: 2,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=10',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      jest.spyOn(pokemonsAdapter, 'findMany').mockResolvedValue(mockResponse);

      const result = await service.findMany(1, 10);

      expect(pokemonsAdapter.findMany).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual<PaginationDto<{ name: string; id: number }>>({
        total: 2,
        totalPages: 1,
        data: [
          { name: 'bulbasaur', id: 1 },
          { name: 'ivysaur', id: 2 },
        ],
      });
    });

    it('should throw an error if adapter throws', async () => {
      jest
        .spyOn(pokemonsAdapter, 'findMany')
        .mockRejectedValue(new Error('API Error'));

      await expect(service.findMany(1, 10)).rejects.toThrow('API Error');
    });
  });

  describe(`${PokemonsService.prototype.findOne.name}`, () => {
    it('should return a single pokemon', async () => {
      const mockAdapterResponse = {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
      };

      jest
        .spyOn(pokemonsAdapter, 'findOne')
        .mockResolvedValue(mockAdapterResponse);

      const result = await service.findOne(1);

      expect(pokemonsAdapter.findOne).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(FindOnePokemonDto);
      expect(result).toEqual({
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
      });
    });

    it('should throw an error if adapter throws', async () => {
      jest
        .spyOn(pokemonsAdapter, 'findOne')
        .mockRejectedValue(new Error('API Error'));

      await expect(service.findOne(1)).rejects.toThrow('API Error');
    });
  });
});
