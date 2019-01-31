import { OperationBase, ValidationError } from "@ne1410s/http";
import { DbContext } from "../../../database/db-context";
import * as apiConfig from "../../../api.json";
import { AuthUtils } from "../../utils/auth";
import { AuthError } from "../../errors/auth";
import { IAuthEntryResponse, IAuthEntryRequest } from "../../interfaces/auth";

export class LoginOperation extends OperationBase<IAuthEntryRequest, IAuthEntryResponse> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IAuthEntryRequest): void {}
    validateResponse(responseData: IAuthEntryResponse): void {}

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

        return {
            token: await AuthUtils.getToken(user.UserID, process.env['acme::jwt'], apiConfig.tokenMinutes)
        };
    }

}