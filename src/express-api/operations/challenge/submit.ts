import { DbContext } from "../../../database/db-context";
import { ISubmitChallengeRequest, ISubmitChallengeResponse } from "../../interfaces/challenge";
import { OperationBase } from "@ne1410s/http";

export class SubmitChallengeOperation extends OperationBase<ISubmitChallengeRequest, ISubmitChallengeResponse> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ISubmitChallengeRequest): void {}
    validateResponse(responseData: ISubmitChallengeResponse): void {}

    protected async invokeInternal(requestData: ISubmitChallengeRequest): Promise<ISubmitChallengeResponse> {
        
        // TODO
    }
}