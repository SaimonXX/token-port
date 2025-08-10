import { join } from 'node:path';
import { DataSource, type DataSourceOptions } from 'typeorm';
//

import { env } from '@config/env.js';

const entitiesPath = join(
	import.meta.dirname,
	'../modules/**/*.entity.{ts,js}',
);

const migrationsPath = join(import.meta.dirname, '../migrations/*.{ts,js}');

const options: DataSourceOptions = {
	type: 'postgres',
	url: env.DATABASE_URL,
	entities: [entitiesPath],
	migrations: [migrationsPath],
};

const AppDataSource = new DataSource(options);

export { AppDataSource };
