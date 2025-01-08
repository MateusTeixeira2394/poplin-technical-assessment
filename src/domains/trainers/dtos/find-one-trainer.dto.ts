import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { FindManyPokemonDto } from '../../pokemons/dtos/find-many-pokemon.dto';
import { FindManyTrainerDto } from './find-many-trainer.dto';

export class FindOneTrainerDto extends FindManyTrainerDto {
  @ApiProperty({
    description: 'The pokemons the trainer has in his pokeballs',
    type: FindManyPokemonDto,
    isArray: true,
  })
  @Expose()
  @Transform(({ value }) =>
    plainToInstance(FindManyPokemonDto, value, { strategy: 'exposeAll' }),
  )
  pokemons: FindManyPokemonDto[];
}
