import dotenv from 'dotenv';
import { envSchema } from './env.schema.js';

dotenv.config();

const result = envSchema.safeParse(process.env);

if (!result.success) {
	throw new Error('The ENV config is invalid. Leaving...', {
		cause: result.error,
	});
}

const env = result.data;

export { env };
