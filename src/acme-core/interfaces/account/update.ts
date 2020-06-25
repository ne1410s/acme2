import { IAccountRequest } from './base';

export interface IUpdateAccountRequest extends IAccountRequest {
  emails: Array<string>;
}

export interface IUpdateAccountPayload {
  contact: Array<string>;
}
