export interface IAuthEntryRequest {
    username: string;
    password: string;
}

export interface IAuthEntryResponse {
    token: string;
}