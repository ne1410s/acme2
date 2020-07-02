import { SecureRequest } from './auth';
import { DomainClaim } from './challenge';
import { Validation } from '@ne1410s/codl';

export class CreateOrderRequest extends SecureRequest {
  accountId: number;
  domains: Array<string>;
}

export class OrderRequest extends SecureRequest {
  @Validation.required
  @Validation.min(0)
  authenticUserId: number;

  orderId: number;
}

export class FinaliseOrderRequest extends OrderRequest {
  company?: string;
  department?: string;
}

export class CertRequest extends OrderRequest {
  certCode: string;
  certType: string;
  password: string;
  friendlyName: string;
}

export class CertResponse {
  contentType: string;
  base64: string;
}

export class OrderMeta {
  @Validation.required
  orderId: number;
  @Validation.required
  accountId: number;
  domains: Array<string>;
}

export class Order {
  orderId: number;
  status: string;
  expires: Date;
  domainClaims: Array<DomainClaim>;
  certCode?: string;
}
