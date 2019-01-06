export interface IAuthEntryRequest {
    username: string;
    password: string;
}

export interface IAuthEntryResponse {
    token: string;
}

export interface IHashResult {
    hash: string;
    salt: string;
}

export interface ISecureRequest {
    authenticUserId: number;
}