
export interface IGetCertRequest {
    certCode: string;
    contentType?: string;
}

export interface IGetCertResponse {
    contentType: string;
    content: string;
}