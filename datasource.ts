import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    'src/application/entities/application.entity.ts',
    'src/key/entities/key.entity.ts',
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
