import { ErrorResult } from '../errors'

type ResponseRecord = Record<string, any>

type ResponseData = Array<ResponseRecord> | ResponseRecord | null | void

export interface SuccessResponse {
  data: ResponseData
  isSuccess: true
}

export interface ErrorResponse {
  errors: Array<ErrorResult>
  isSuccess: false
}
