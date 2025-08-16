export const API_PREFIX = 'api';
export const API_VERSION = 'v1';
export const BASE_API_PATH = `/${API_PREFIX}/${API_VERSION}`;

const definitions = {
	auth: {
		base: 'auth',
		endpoints: {
			email: 'email',
			tokenExchange: 'token/exchange',
		},
	},
} as const;

type ModuleKey = keyof typeof definitions;
type EndpointKey<M extends ModuleKey> =
	keyof (typeof definitions)[M]['endpoints'];

type BuiltRoutes = {
	[K in keyof typeof definitions]: {
		base: (typeof definitions)[K]['base'];
		fullPath: `/${typeof API_PREFIX}/${typeof API_VERSION}/${(typeof definitions)[K]['base']}`;
		endpoints: {
			[EK in EndpointKey<K>]: {
				path: (typeof definitions)[K]['endpoints'][EK];
				fullPath: `/${typeof API_PREFIX}/${typeof API_VERSION}/${(typeof definitions)[K]['base']}/${(typeof definitions)[K]['endpoints'][EK] & string}`;
			};
		};
	};
};

const buildRoutes = (): BuiltRoutes => {
	return Object.fromEntries(
		Object.entries(definitions).map(([moduleKey, mod]) => {
			const builtEndpoints = Object.fromEntries(
				Object.entries(mod.endpoints).map(([endpointKey, endpointPath]) => {
					return [
						endpointKey,
						{
							path: endpointPath,
							fullPath: `${BASE_API_PATH}/${mod.base}/${endpointPath}`,
						},
					];
				}),
			);

			return [
				moduleKey,
				{
					base: mod.base,
					fullPath: `${BASE_API_PATH}/${mod.base}`,
					endpoints: builtEndpoints,
				},
			];
		}),
	) as BuiltRoutes;
};

export const routes: BuiltRoutes = buildRoutes();
