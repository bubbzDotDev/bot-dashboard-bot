import { DataSource } from 'typeorm';
import { GuildConfiguration } from './entities/GuildConfiguration';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_DB_HOST,
  port: +process.env.MYSQL_DB_PORT,
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_DATABASE,
  synchronize: JSON.parse(process.env.MYSQL_DB_SYNCHRONIZE), // true while in development, false in production
  entities: [ GuildConfiguration ],
  ssl: {
    rejectUnauthorized: true,
  },
});