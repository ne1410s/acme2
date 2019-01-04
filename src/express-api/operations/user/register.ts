import { OperationBase, ValidationError } from "@ne1410s/http";
import { IRegisterRequest, IRegisterResponse } from "../../interfaces/user/register";
import { DbContext } from "../../../database/dbContext";
import { AuthUtils } from "../../utils/auth";

export class RegisterOperation extends OperationBase<IRegisterRequest, IRegisterResponse> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IRegisterRequest): void {
        
        const messages: string[] = [];

        if (!requestData.username) {
            messages.push('Username is required');
        }
        else if (requestData.username.length < 6) {
            messages.push('Username must be at least 6 characters');
        }

        if (!requestData.password) {
            messages.push('Password is required');
        }
        else if (requestData.password.length < 6) {
            messages.push('Password must be at least 6 characters')
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }
    
    validateResponse(responseData: IRegisterResponse): void {
        //
    }

    protected async invokeInternal(requestData: IRegisterRequest): Promise<IRegisterResponse> {
        
        const result = await this.db.dbUser.findAll({
            where: { UserName: requestData.username }
        });

        if (result.length != 0) {
            throw new ValidationError('The request is invalid', requestData, ['The username is not available']);
        }

        const hashResult = await AuthUtils.getHash(requestData.password);

        const newRecord: any = await this.db.dbUser.create({
            UserID: 0,
            UserName: requestData.username,
            PasswordHash: hashResult.hash,
            PasswordSalt: hashResult.salt,
            LastActivity: new Date()
        });

        return {
            userId: newRecord.UserID,
            token: await AuthUtils.getToken(newRecord.UserID)
        };
    }

}