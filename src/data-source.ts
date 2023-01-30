import "reflect-metadata"
import { DataSource } from "typeorm"
require('dotenv').config();
import config from 'config'
const postgresConfig = config.get<{
    host: string;
    port: number;
    username: string;
    password: string;
    datsbase: string;
  }>('postgresConfig');
  
export const AppDataSource = new DataSource({
    type: "postgres",
    ...postgresConfig,
    entities : ['src/entities/**/*.ts'],
    synchronize : true
})
