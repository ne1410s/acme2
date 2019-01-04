export interface IRegisterRequest {
    username: string;
    password: string;
}

export interface IRegisterResponse {
    userId: number;
    token: string;
}