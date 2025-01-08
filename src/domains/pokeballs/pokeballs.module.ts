import { Module } from '@nestjs/common';
import { PokeballsController } from './pokeballs.controller';
import { PokeballsService } from './pokeballs.service';
import { HttpModule } from 'src/infra/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [PokeballsController],
  providers: [PokeballsService],
})
export class PokeballsModule {}
