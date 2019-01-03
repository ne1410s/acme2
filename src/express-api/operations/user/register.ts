import { OperationBase } from "@ne1410s/http";
import { verbose } from "sqlite3";
import { IRegisterRequest, IRegisterResponse } from "../../interfaces/user/register";

export class RegisterOperation extends OperationBase<IRegisterRequest, IRegisterResponse> {

    validateRequest(requestData: IRegisterRequest): void {
        throw new Error("Method not implemented.");
    }
    
    validateResponse(responseData: IRegisterResponse): void {
        throw new Error("Method not implemented.");
    }

    protected invokeInternal(requestData: IRegisterRequest): Promise<IRegisterResponse> {
        throw new Error("Method not implemented.");
    }

}