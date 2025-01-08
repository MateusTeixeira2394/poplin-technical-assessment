import { Module } from '@nestjs/common';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { HttpModule } from '../../infra/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [PokemonsController],
  providers: [PokemonsService],
})
export class PokemonsModule {}
