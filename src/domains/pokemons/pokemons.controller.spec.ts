import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from 'src/infra/shared/dtos/pagination.dto';
import { FindManyPokemonDto } from './dtos/find-many-pokemon.dto';
import { FindOnePokemonDto } from './dtos/find-one-pokemon.dto';

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [
        {
          provide: PokemonsService,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  describe(`${PokemonsController.prototype.findMany.name}`, () => {
    it('should return a paginated list of pokemons', async () => {
      const mockPaginationQuery = { page: 1, limit: 10 };
      const mockPagination: PaginationDto<FindManyPokemonDto> = {
        total: 2,
        totalPages: 1,
        data: [
          { name: 'bulbasaur', id: 1 },
          { name: 'ivysaur', id: 2 },
        ],
      };

      jest.spyOn(service, 'findMany').mockResolvedValue(mockPagination);

      const result = await controller.findMany(mockPaginationQuery);

      expect(service.findMany).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockPagination);
    });

    it('should throw an error if service throws', async () => {
      jest
        .spyOn(service, 'findMany')
        .mockRejectedValue(new Error('Service Error'));

      await expect(controller.findMany({ page: 1, limit: 10 })).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe(`${PokemonsController.prototype.findOne.name}`, () => {
    it('should return a single pokemon', async () => {
      const mockPokemon: FindOnePokemonDto = {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPokemon);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPokemon);
    });

    it('should throw an error if service throws', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Service Error'));

      await expect(controller.findOne(1)).rejects.toThrow('Service Error');
    });
  });
});
