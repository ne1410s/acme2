import { OperationBase, ValidationError } from "@ne1410s/http";
import { IAuthEntryRequest, IAuthEntryResponse } from "../../interfaces/auth";
import { DbContext } from "../../../database/db-context";
import { AuthUtils } from "../../utils/auth";

export class RegisterOperation extends OperationBase<IAuthEntryRequest, IAuthEntryResponse> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IAuthEntryRequest): void {
        
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
    
    validateResponse(responseData: IAuthEntryResponse): void {
        //
    }

    protected async invokeInternal(requestData: IAuthEntryRequest): Promise<IAuthEntryResponse> {
        
        const result = await this.db.dbUser.findAll({
            where: { UserName: requestData.username }
        });

        if (result.length != 0) {
            throw new ValidationError('The request is invalid', requestData, ['The username is not available']);
        }

        const hashResult = await AuthUtils.getHash(requestData.password);

        const newUser: any = await this.db.dbUser.create({
            UserID: 0,
            UserName: requestData.username,
            PasswordHash: hashResult.hash,
            PasswordSalt: hashResult.salt,
            LastActivity: new Date()
        });

        const config = await this.db.dbConfig.findOne() as any;

        return {
            token: await AuthUtils.getToken(newUser.UserID, config.AppSecret)
        };
    }

}