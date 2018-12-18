
export interface IGetCertRequest {
    contentType: string;
    certificateUrl: string;
}

export interface IGetCertResponse {
    contentType: string;
    content: string;
}