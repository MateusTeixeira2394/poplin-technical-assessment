import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'The list of items for the current page',
    isArray: true,
  })
  data: T[];
}
