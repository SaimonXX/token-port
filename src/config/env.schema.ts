import { z } from 'zod'

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Secrets de OAuth de Google
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID no puede estar vacío'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET no puede estar vacío'),

  // Secrets de OAuth de GitHub
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),

  // Secrets para JWT
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),

  // URLs del entorno
  BACKEND_URL: z.url('BACKEND_URL debe ser una URL válida'),
  FRONTEND_URL: z.url('FRONTEND_URL debe ser una URL válida'),

  // URL de la Base de Datos
  DATABASE_URL: z.url('DATABASE_URL debe ser una URL válida'),

  // Configuración del servidor
  PORT: z.coerce.number().int().positive().default(3000),

  // Token para logging
  LOGTAIL_SOURCE_TOKEN: z.string().min(1),
  LOGTAIL_ENDPOINT: z.string().min(1)
})

type Env = z.infer<typeof envSchema>

export { envSchema, type Env }
