import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const PRODUCTION: string = 'production';
const DEVELOPMENT: string = 'development';

const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

dotenv.config({ path: `.env${NODE_ENV === PRODUCTION ? '' : '.' + NODE_ENV}` });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [__dirname + `/entities/*.entity{.ts,.js}`],
  migrations: [__dirname + `/migrations/*{.ts,.js}`],
  synchronize: false,
});
