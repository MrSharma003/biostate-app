import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

export const cacheConfig: CacheModuleOptions = {
  store: redisStore,
  host: 'localhost',
  port: 6379, // Redis port
  ttl: 3600,
};
