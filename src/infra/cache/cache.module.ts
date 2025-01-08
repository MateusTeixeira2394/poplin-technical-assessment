import { Module } from '@nestjs/common';
import { RedisAdapter } from './redis.adapter';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [RedisAdapter],
  exports: [RedisAdapter],
})
export class CacheModule {}
