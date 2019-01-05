import { OperationBase } from "@ne1410s/http";
import { DbContext } from "../../../database/dbContext";
import { ICreateAccountResponse, ICreateAccountRequest } from "../../interfaces/account/create";

export class CreateAccountOperation extends OperationBase<ICreateAccountRequest, ICreateAccountResponse> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ICreateAccountRequest): void {
        
        console.log('\r\n\r\n------------OMG----------\r\n', requestData);
    }
    
    validateResponse(responseData: ICreateAccountResponse): void {
        //
    }
    
    protected invokeInternal(requestData: ICreateAccountRequest): Promise<ICreateAccountResponse> {
        throw new Error("Method not implemented.");
    }
}