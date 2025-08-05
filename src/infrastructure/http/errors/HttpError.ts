export class HttpError extends Error {
  public readonly statusCode: number
  public readonly status: 'fail' | 'error'
  public readonly isOperational: boolean

  constructor (message: string, statusCode: number, cause?: Error) {
    super(message, { cause })

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}