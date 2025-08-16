import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),

	PORT: z.coerce.number().int().positive().default(3000),

	ALLOWED_REDIRECT_URIS: z
		.string()
		.transform((str) => str.split(',').map((s) => s.trim())),

	DATABASE_URL: z.url('DATABASE_URL debe ser una URL válida'),

	// Secrets de OAuth de Google
	GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID no puede estar vacío'),
	GOOGLE_CLIENT_SECRET: z
		.string()
		.min(1, 'GOOGLE_CLIENT_SECRET no puede estar vacío'),

	// Secrets para JWT
	ACCESS_TOKEN_SECRET: z.string().min(1),
	REFRESH_TOKEN_SECRET: z.string().min(1),

	// Token para logging
	LOGTAIL_SOURCE_TOKEN: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

export { envSchema, type Env };
