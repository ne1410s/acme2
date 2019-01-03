import { OperationBase } from "@ne1410s/http";
import { verbose } from "sqlite3";
import { ILoginResponse, ILoginRequest } from "../../interfaces/user/login";

export class LoginOperation extends OperationBase<ILoginRequest, ILoginResponse> {

    validateRequest(requestData: ILoginRequest): void {
        throw new Error("Method not implemented.");
    }
    
    validateResponse(responseData: ILoginResponse): void {
        throw new Error("Method not implemented.");
    }

    protected invokeInternal(requestData: ILoginRequest): Promise<ILoginResponse> {
        throw new Error("Method not implemented.");
    }

}