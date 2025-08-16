export type LogInput = {
	message: string;
	error?: Error;
	metadata?: Record<string, unknown>;
};

export interface Logger {
	info: (input: LogInput) => void;
	warn: (input: LogInput) => void;
	error: (input: LogInput) => void;
	debug: (input: LogInput) => void;
}
