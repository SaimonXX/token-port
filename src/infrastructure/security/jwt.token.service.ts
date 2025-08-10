import jwt from 'jsonwebtoken';
//

import { env } from '@config/env.js';
import type {
	AuthTokens,
	TokenService,
	UserProfileDTO,
} from '@modules/auth/domain/auth.domain.js';

export class JwtTokenService implements TokenService {
	public async generateAuthTokens(user: UserProfileDTO): Promise<AuthTokens> {
		const accessTokenPayload = { id: user.id, name: user.name };
		const refreshTokenPayload = { id: user.id };

		const accessToken = jwt.sign(accessTokenPayload, env.ACCESS_TOKEN_SECRET, {
			expiresIn: '15m',
		});
		const refreshToken = jwt.sign(
			refreshTokenPayload,
			env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: '7d',
			},
		);

		return { accessToken, refreshToken };
	}
}
