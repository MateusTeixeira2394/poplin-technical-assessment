import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PokemonsService } from './pokemons.service';
import { PaginationQueryDto } from '../../infra/shared/dtos/pagination-query.dto';
import { PaginationDto } from '../../infra/shared/dtos/pagination.dto';
import { FindManyPokemonDto } from './dtos/find-many-pokemon.dto';
import { FindOnePokemonDto } from './dtos/find-one-pokemon.dto';

@ApiTags('Pokemons')
@Controller('pokemons')
export class PokemonsController {
  constructor(private service: PokemonsService) {}

  @Get()
  @ApiOkResponse({
    description: 'A paginated list of pokemons',
    type: PaginationDto,
  })
  public async findMany(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginationDto<FindManyPokemonDto>> {
    try {
      const page: number = query.page ?? 1;
      const limit: number = query.limit ?? 20;
      return await this.service.findMany(page, limit);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'A paginated list of pokemons',
    type: PaginationDto,
  })
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindOnePokemonDto> {
    try {
      return this.service.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
