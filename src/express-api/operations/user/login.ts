import { OperationBase, ValidationError } from "@ne1410s/http";
import { ILoginResponse, ILoginRequest } from "../../interfaces/user/login";
import { DbContext } from "../../../database/dbContext";
import { AuthUtils } from "../../utils/auth";

export class LoginOperation extends OperationBase<ILoginRequest, ILoginResponse> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ILoginRequest): void {
       
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
    
    validateResponse(responseData: ILoginResponse): void {
        //
    }

    protected async invokeInternal(requestData: ILoginRequest): Promise<ILoginResponse> {

        const messages: string[] = [];

        const result = await this.db.dbUser.findAll({
            where: { UserName: requestData.username }
        });

        if (result.length !== 1) {
            messages.push('401 (Dev: No such user exists)');
        }
        else { 
            const user = result[0] as any,
                  testParams = { hash: user.PasswordHash, salt: user.PasswordSalt };

            if (!await AuthUtils.testHash(requestData.password, testParams)) {
                messages.push('401 (Dev: Bad pass)');
            }
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        return {
            token: await AuthUtils.getToken((result[0] as any).UserID)
        };
    }

}