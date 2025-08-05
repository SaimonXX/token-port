import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import stringify from 'safe-stable-stringify';
import winston from 'winston';
//

import { env } from '@config/env.js';
import type { Logger, LogInput } from '@modules/shared/domain/logger.domain.js';

class WinstonLogger implements Logger {
	private readonly winstonInstance: winston.Logger;

	constructor() {
		const levels = {
			error: 0,
			warn: 1,
			info: 2,
			http: 3,
			debug: 4,
		};

		const colors = {
			error: 'red',
			warn: 'yellow',
			info: 'green',
			http: 'magenta',
			debug: 'blue',
		};

		winston.addColors(colors);

		const baseFormat = winston.format((info) => {
			const { level, message, timestamp, error, ...metadata } = info;

			const logOutput: winston.Logform.TransformableInfo = {
				level,
				message,
				timestamp,
			};

			if (error instanceof Error) {
				logOutput.error = {
					name: error.name,
					message: error.message,
					stack: error.stack,
				};
			}

			if (Object.keys(metadata).length > 0) {
				logOutput.metadata = metadata;
			}

			return logOutput;
		});

		const consoleFormat = winston.format.combine(
			winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			winston.format.colorize({ all: true }),
			baseFormat(),
			winston.format.printf((info) => {
				const { level, timestamp, message, ...metadata } = info;

				let log = `\n[${String(timestamp)}] [${level}]: Message: ${String(message)}`;

				if (Object.keys(metadata).length > 0) {
					log += `\n${stringify(metadata, null, 2)}`;
				}
				return log;
			}),
		);

		const fileAndLoggerFormat = winston.format.combine(
			winston.format.timestamp(),
			baseFormat(),
			winston.format.json(),
		);

		const transports: winston.transport[] = [
			new winston.transports.File({
				filename: 'logs/error.log',
				level: 'error',
				format: fileAndLoggerFormat,
			}),
		];

		if (env.NODE_ENV === 'production') {
			const logtail = new Logtail(env.LOGTAIL_SOURCE_TOKEN);
			if (env.LOGTAIL_SOURCE_TOKEN) {
				transports.push(
					new LogtailTransport(logtail, {
						level: 'info',
						format: fileAndLoggerFormat,
					}),
				);
			}
		} else {
			transports.push(
				new winston.transports.Console({
					format: consoleFormat,
				}),
				new winston.transports.File({
					filename: 'logs/all.log',
					format: fileAndLoggerFormat,
				}),
			);
		}

		this.winstonInstance = winston.createLogger({
			level: env.NODE_ENV === 'development' ? 'debug' : 'info',
			levels,
			transports,
		});
	}

	public info(input: LogInput): void {
		this.winstonInstance.info({ ...input });
	}

	public warn(input: LogInput): void {
		this.winstonInstance.warn({ ...input });
	}

	public error(input: LogInput): void {
		this.winstonInstance.error({ ...input });
	}

	public debug(input: LogInput): void {
		this.winstonInstance.debug({ ...input });
	}
}

export const winstonLogger = new WinstonLogger()