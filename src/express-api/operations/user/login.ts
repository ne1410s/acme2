import { OperationBase, ValidationError } from "@ne1410s/http";
import { DbContext } from "../../../database/db-context";
import { AuthUtils } from "../../utils/auth";
import { AuthError } from "../../errors/auth";
import { IAuthEntryResponse, IAuthEntryRequest } from "../../interfaces/auth";

export class LoginOperation extends OperationBase<IAuthEntryRequest, IAuthEntryResponse> {

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

        const user = result[0] as any;

        let denyAuth = result.length !== 1;
        if (!denyAuth) {
            const testParams = { hash: user.PasswordHash, salt: user.PasswordSalt };
            denyAuth = !await AuthUtils.verifyHash(requestData.password, testParams);
        }

        if (denyAuth) {
            throw new AuthError();
        }

        const config = await this.db.dbConfig.findOne() as any;

        return {
            token: await AuthUtils.getToken(user.UserID, config.AppSecret)
        };
    }

}