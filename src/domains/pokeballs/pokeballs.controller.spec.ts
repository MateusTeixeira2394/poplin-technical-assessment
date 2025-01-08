import { Test, TestingModule } from '@nestjs/testing';
import { PokeballsController } from './pokeballs.controller';
import { PokeballsService } from './pokeballs.service';
import { QueryFindManyPokeballsDto } from './dtos/query-find-many-pokeballs.dto';
import { CreatePokeballDto } from './dtos/create-pokeball.dto';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { PokeballDto } from './dtos/pokeballs.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('PokeballsController', () => {
  let controller: PokeballsController;
  let service: PokeballsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokeballsController],
      providers: [
        {
          provide: PokeballsService,
          useValue: {
            findMany: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokeballsController>(PokeballsController);
    service = module.get<PokeballsService>(PokeballsService);
  });

  describe(`${PokeballsController.prototype.findMany.name}`, () => {
    it('should return a paginated list of pokeballs', async () => {
      const mockQuery: QueryFindManyPokeballsDto = {
        page: 1,
        limit: 10,
        pokemonId: 1,
        trainerId: 1,
      };

      const mockPagination: PaginationDto<PokeballDto> = {
        total: 2,
        totalPages: 1,
        data: [
          { id: 1, pokemonId: 1, trainerId: 1 },
          { id: 2, pokemonId: 2, trainerId: 1 },
        ],
      };

      jest.spyOn(service, 'findMany').mockResolvedValue(mockPagination);

      const result = await controller.findMany(mockQuery);

      expect(service.findMany).toHaveBeenCalledWith(1, 10, 1, 1);
      expect(result).toEqual(mockPagination);
    });
  });

  describe(`${PokeballsController.prototype.create.name}`, () => {
    it('should create a new pokeball', async () => {
      const mockCreateDto: CreatePokeballDto = { pokemonId: 1, trainerId: 1 };
      const mockPokeball: PokeballDto = { id: 1, pokemonId: 1, trainerId: 1 };

      jest.spyOn(service, 'create').mockResolvedValue(mockPokeball);

      const result = await controller.create(mockCreateDto);

      expect(service.create).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockPokeball);
    });

    it('should throw an error if service throws an error', async () => {
      const mockCreateDto: CreatePokeballDto = { pokemonId: 1, trainerId: 1 };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException('Trainer not found'));

      await expect(controller.create(mockCreateDto)).rejects.toThrow(
        'Trainer not found',
      );
    });
  });

  describe(`${PokeballsController.prototype.delete.name}`, () => {
    it('should delete a pokeball and respond with no content', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(service, 'delete').mockResolvedValue();

      await controller.delete(1, mockResponse);

      expect(service.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw an error if service throws an error', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new BadRequestException('Pokeball not found'));

      await expect(controller.delete(1, mockResponse)).rejects.toThrow(
        'Pokeball not found',
      );
    });
  });
});
