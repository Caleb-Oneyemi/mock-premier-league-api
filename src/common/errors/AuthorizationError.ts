import { CustomError, ErrorResult } from './CustomError'

export class AuthorizationError extends CustomError {
  statusCode = 403

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
