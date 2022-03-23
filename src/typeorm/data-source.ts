import { DataSource } from 'typeorm';
import { GuildConfiguration } from './entities/GuildConfiguration';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_DB_HOST,
  port: +process.env.MYSQL_DB_PORT, // + converts the string to a number
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_DATABASE,
  synchronize: true, // true while in development,
  entities: [ GuildConfiguration ],
});