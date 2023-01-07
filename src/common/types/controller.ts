import { ResponseData } from './response'

/**
 T represents the type expected in the request body while
 U represents the type expected in the request params and
 V represents the type expected in the request query
 */
export interface ControllerInput<
  T extends object = any,
  U extends object = any,
  V extends object = any,
> {
  input: T
  params: U
  query: V
}

export type ControllerFn = (input: ControllerInput) => Promise<ResponseData>
