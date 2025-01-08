import { Test, TestingModule } from '@nestjs/testing';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dtos/create-trainer-dto';
import { FindOneTrainerDto } from './dtos/find-one-trainer.dto';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { FindManyTrainerDto } from './dtos/find-many-trainer.dto';
import { PatchTrainerDto } from './dtos/patch-trainer.dto';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('TrainersController', () => {
  let controller: TrainersController;
  let service: TrainersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainersController],
      providers: [
        {
          provide: TrainersService,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findOne: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TrainersController>(TrainersController);
    service = module.get<TrainersService>(TrainersService);
  });

  describe(`${TrainersController.prototype.create.name}`, () => {
    it('should create a new trainer', async () => {
      const dto: CreateTrainerDto = { firstName: 'Ash', lastName: 'Ketchum' };
      const mockTrainer: FindOneTrainerDto = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        pokemons: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockTrainer);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTrainer);
    });
  });

  describe(`${TrainersController.prototype.findMany.name}`, () => {
    it('should return a paginated list of trainers', async () => {
      const mockQuery = { page: 1, limit: 10 };
      const mockPagination: PaginationDto<FindManyTrainerDto> = {
        total: 2,
        totalPages: 1,
        data: [
          { id: 1, firstName: 'Ash', lastName: 'Ketchum' },
          { id: 2, firstName: 'Misty', lastName: 'Waterflower' },
        ],
      };

      jest.spyOn(service, 'findMany').mockResolvedValue(mockPagination);

      const result = await controller.findMany(mockQuery);

      expect(service.findMany).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockPagination);
    });
  });

  describe(`${TrainersController.prototype.findOne.name}`, () => {
    it('should return a trainer and their pokemons', async () => {
      const mockTrainer: FindOneTrainerDto = {
        id: 1,
        firstName: 'Ash',
        lastName: 'Ketchum',
        pokemons: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTrainer);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrainer);
    });

    it('should throw if trainer is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Trainer not found'));

      await expect(controller.findOne(1)).rejects.toThrow('Trainer not found');
    });
  });

  describe(`${TrainersController.prototype.patch.name}`, () => {
    it('should update a trainer', async () => {
      const dto: PatchTrainerDto = { firstName: 'Ash Updated' };
      const mockTrainer: FindManyTrainerDto = {
        id: 1,
        firstName: 'Ash Updated',
        lastName: 'Ketchum',
      };

      jest.spyOn(service, 'patch').mockResolvedValue(mockTrainer);

      const result = await controller.patch(1, dto);

      expect(service.patch).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockTrainer);
    });

    it('should throw if trainer is not found', async () => {
      jest
        .spyOn(service, 'patch')
        .mockRejectedValue(new Error('Trainer not found'));

      await expect(
        controller.patch(1, { firstName: 'Ash Updated' }),
      ).rejects.toThrow('Trainer not found');
    });
  });

  describe(`${TrainersController.prototype.delete.name}`, () => {
    it('should delete a trainer and return no content', async () => {
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

    it('should throw if trainer is not found', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new Error('Trainer not found'));

      await expect(controller.delete(1, mockResponse)).rejects.toThrow(
        'Trainer not found',
      );
    });
  });
});
