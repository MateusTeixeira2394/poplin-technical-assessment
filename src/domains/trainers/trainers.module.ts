import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { HttpModule } from 'src/infra/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [TrainersController],
  providers: [TrainersService],
})
export class TrainersModule {}
