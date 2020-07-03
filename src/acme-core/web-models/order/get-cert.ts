import { Validation } from '@ne1410s/codl';

export class GetCertRequest {
  @Validation.required
  certCode: string;

  @Validation.options(
    'application/pem-certificate-chain',
    'application/pkcs7-mime',
    'application/pkix-cert',
    'application/x-pkcs12'
  )
  contentType?: string;
}

export class GetCertResponse {
  @Validation.required
  @Validation.options(
    'application/pem-certificate-chain',
    'application/pkcs7-mime',
    'application/pkix-cert',
    'application/x-pkcs12'
  )
  contentType: string;

  @Validation.required
  @Validation.minLength(1)
  content: string;
}
