import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../infra/shared/dtos/pagination-query.dto';

export class QueryFindManyPokeballsDto extends PaginationQueryDto {
  @ApiProperty({
    description: `To filter pokeballs by pokemon id`,
    type: Number,
    required: false,
  })
  @IsOptional()
  pokemonId?: number;

  @ApiProperty({
    description: `To filter pokeballs by trainer id`,
    type: Number,
    required: false,
  })
  @IsOptional()
  trainerId?: number;
}
