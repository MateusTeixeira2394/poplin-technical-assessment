import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindOneTrainerDto } from './dtos/find-one-trainer.dto';
import { CreateTrainerDto } from './dtos/create-trainer-dto';
import { TrainersService } from './trainers.service';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { FindManyTrainerDto } from './dtos/find-many-trainer.dto';
import { PaginationQueryDto } from '../../infra/shared/dtos/pagination-query.dto';
import { PatchTrainerDto } from './dtos/patch-trainer.dto';
import { Response } from 'express';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(private service: TrainersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The created trainer data',
    type: FindOneTrainerDto,
  })
  public create(@Body() body: CreateTrainerDto) {
    try {
      return this.service.create(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'A paginated list of trainers',
    type: PaginationDto,
  })
  public findMany(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginationDto<FindManyTrainerDto>> {
    const page: number = query.page ?? 1;
    const limit: number = query.limit ?? 20;
    return this.service.findMany(page, limit);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'It retrieves the trainer data with its all pokemons',
    type: FindOneTrainerDto,
  })
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindOneTrainerDto> {
    try {
      return this.service.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'It update the trainer data',
    type: FindManyTrainerDto,
  })
  public async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchTrainerDto,
  ): Promise<FindManyTrainerDto> {
    try {
      return this.service.patch(id, body);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Trainer has been deleted successfully',
  })
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.service.delete(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw error;
    }
  }
}
