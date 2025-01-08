import { Injectable } from '@nestjs/common';
import { CachePort } from './cache.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisAdapter implements CachePort {
  constructor(
    @InjectRedis()
    private redis: Redis,
  ) {}

  public async get(key: string): Promise<string | undefined> {
    return await this.redis.get(key);
  }

  public async set(
    key: string,
    value: string,
    ttl: number = 24 * 60 * 60,
  ): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }
}
