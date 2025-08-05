import type { NextFunction, Request, Response } from 'express';
//

import type { GenerateTokensUseCase } from '@modules/auth/application/generate-tokens.use-case.js';
import type { UserProfileDTO } from '@modules/auth/domain/auth.domain.js';

class DefaultAuthController {
	// private readonly generateTokensUseCase: GenerateTokensUseCase;

	constructor(private readonly generateTokensUseCase: GenerateTokensUseCase) {}

	public externalProviderCallback = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userProfile = req.user as UserProfileDTO;
			const tokens = await this.generateTokensUseCase.execute(userProfile);

			res.status(200).json({
				status: 'success',
				data: {
					user: userProfile,
					tokens,
				},
			});
		} catch (error) {
			next(error);
		}
	};
}

export { DefaultAuthController };
