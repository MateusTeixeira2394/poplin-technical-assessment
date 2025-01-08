import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { CreatePokeballDto } from './dtos/create-pokeball.dto';
import { PokeballDto } from './dtos/pokeballs.dto';
import { QueryFindManyPokeballsDto } from './dtos/query-find-many-pokeballs.dto';
import { PokeballsService } from './pokeballs.service';

@ApiTags('Pokeballs')
@Controller('pokeballs')
export class PokeballsController {
  constructor(private service: PokeballsService) {}

  @Get()
  @ApiOkResponse({
    description: 'A paginated list of pokeballs',
    type: PaginationDto,
  })
  public async findMany(
    @Query() query: QueryFindManyPokeballsDto,
  ): Promise<PaginationDto<PokeballDto>> {
    const page: number = query.page ?? 1;
    const limit: number = query.limit ?? 20;
    const { pokemonId, trainerId } = query;
    return this.service.findMany(page, limit, pokemonId, trainerId);
  }

  @Post()
  @ApiOperation({
    summary: 'Use the pokeball to catch a pokemon',
    description:
      'This endpoint creates a new pokeboll to catch a pokemon to a trainer. A trainer cannot have more than 6 pokeballs',
  })
  @ApiOkResponse({
    description: 'Create a new pokeball, giving a new pokemon to a trainer',
    type: PaginationDto,
  })
  public async create(
    @Body() { pokemonId, trainerId }: CreatePokeballDto,
  ): Promise<PokeballDto> {
    try {
      return this.service.create(pokemonId, trainerId);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete the pokeballs to let pokemons go away',
  })
  @ApiNoContentResponse({
    description: 'Pokeball has been deleted successfully',
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
