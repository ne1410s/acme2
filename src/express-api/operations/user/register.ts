import { OperationBase, ValidationError } from "@ne1410s/http";
import * as apiConfig from "../../../api.json"
import { IRegisterRequest, IAuthEntryResponse } from "../../interfaces/auth";
import { DbContext } from "../../../database/db-context";
import { AuthUtils } from "../../utils/auth";

export class RegisterOperation extends OperationBase<IRegisterRequest, IAuthEntryResponse> {

    private readonly recaptchaUrl: string = 'https://www.google.com/recaptcha/api/siteverify'; 

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
            messages.push('Password must be at least 6 characters');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }
    
    validateResponse(responseData: IAuthEntryResponse): void {
        //
    }

    protected async invokeInternal(requestData: IRegisterRequest): Promise<IAuthEntryResponse> {
        
        const recaptchaOk = await this.validateRecaptcha(requestData.recaptcha);
        if (!recaptchaOk) {
            throw new Error('Data anomaly');
        }

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

    private async validateRecaptcha(token: string): Promise<boolean> {
        
        const url = `${this.recaptchaUrl}?response=${token}&secret=${apiConfig.recaptchaSecret}`,
              response = await fetch(url, { method: 'POST' }),
              json = await response.json();

        let isValid = true;

        isValid = isValid && response.ok;
        isValid = isValid && json.success === true;       
        isValid = isValid && json.action === 'register';
        isValid = isValid && json.score >= 0.7;

        if (!isValid) {
            console.warn('Recaptcha failed', json);
        }

        return isValid;
    }
}