import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FindManyTrainerDto {
  @ApiProperty({
    description: 'Trainer id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Trainer first name',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Trainer last name',
  })
  @Expose()
  lastName: string;
}
