import "reflect-metadata"
import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config()

import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: process.env.DB_CHARSET,
    synchronize: false,
    logging: false,
    poolSize: Number(process.env.DB_POOL_SIZE),
    entityPrefix: `${process.env.DB_PREFIX}_`,
    entities: ["build/src/entity/*.entity.js"],
    migrations: ['build/src/migrations/*.js'],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })