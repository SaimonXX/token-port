import type { NextFunction, Request, Response } from 'express';

//

import type { ExchangeCodeUseCase } from '@modules/auth/application/exchange-code.use-case.js';
import type { GenerateTokensUseCase } from '@modules/auth/application/generate-tokens.use-case.js';

// import type { UserProfileDTO } from '@modules/auth/domain/auth.domain.js';

class DefaultAuthController {
	constructor(
		private readonly generateTokensUseCase: GenerateTokensUseCase,
		private readonly exchangeCodeUseCase: ExchangeCodeUseCase,
	) {}

	public exchangeCode = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const user = await this.exchangeCodeUseCase.execute(req.body);
			const tokens = await this.generateTokensUseCase.execute(user);

			res.status(200).json({
				status: 'success',
				data: {
					user,
					tokens,
				},
			});
		} catch (error) {
			next(error);
		}
	};
}

export { DefaultAuthController };
