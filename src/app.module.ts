import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonsModule } from './domains/pokemons/pokemons.module';
import configuration from './infra/config/configuration';
import { HttpModule } from './infra/http/http.module';
import { TrainersModule } from './domains/trainers/trainers.module';
import { DatabaseModule } from './infra/database/database.module';
import { PokeballsModule } from './domains/pokeballs/pokeballs.module';
import { CacheModule } from './infra/cache/cache.module';

const PRODUCTION: string = 'production';
const DEVELOPMENT: string = 'development';

const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env${NODE_ENV === PRODUCTION ? '' : '.' + NODE_ENV}`,
    }),
    CacheModule,
    DatabaseModule,
    HttpModule,
    PokemonsModule,
    TrainersModule,
    PokeballsModule,
    CacheModule,
  ],
})
export class AppModule {}
