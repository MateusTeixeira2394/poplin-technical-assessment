export default () => ({
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  },
  redis: {
    url: process.env.REDIS_URL,
    ttl: parseInt(process.env.REDIS_TTL || '86400'),
  },
  pokemon_api: process.env.POKEMON_API,
  client: process.env.CLIENT_HOST,
});

export interface DatabaseSecrets {
  host: string;
  port: number;
  user: string;
  pass: string;
  database: string;
}

export interface RedisSercrets {
  url: string;
  ttl: number;
}
