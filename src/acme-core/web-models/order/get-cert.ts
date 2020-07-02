import { Validation } from '@ne1410s/codl';

export class GetCertRequest {
  @Validation.required
  certCode: string;
  contentType?: string;
}

export class GetCertResponse {
  contentType: string;
  content: string;
}
