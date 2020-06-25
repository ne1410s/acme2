import { ICsr_Result } from '@ne1410s/crypto/dist/interfaces';
import { IResponse } from '../token/base';
import { IAccountRequest } from '../account/base';
import { IOrderRequest } from './base';
import { IDomainIdentfier } from './upsert';

export interface IFinaliseOrderRequest extends IOrderRequest, IAccountRequest {
  identifiers: Array<IDomainIdentfier>;
  originalCsr?: ICsr_Result;
  company?: string;
  department?: string;
}

export interface IFinaliseOrderPayload {
  csr: string;
}

export interface IFinaliseOrderResponse extends IResponse {
  status: string;
  expires: Date;
  certificateUrl: string;
  originalCsr: ICsr_Result;
}
