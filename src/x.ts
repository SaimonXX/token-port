import { winstonLogger } from "@modules/shared/infrastructure/logger/winston.logger.js";

const err = new Error('Error de prueba1');
winstonLogger.error({
	message: 'Mensaje de error de prueba',
	error: err,
	metadata: { extraData: 'value of extra data' },
});
