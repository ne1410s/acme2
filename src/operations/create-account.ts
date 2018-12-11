import { NonAccountOperation } from "./base/non-account";
import { ICreateAccountRequest, IAccountDetails } from "../requests/account";
import { ValidationError } from "@ne1410s/http";

export class CreateAccountOperation extends NonAccountOperation<ICreateAccountRequest, IAccountDetails> {
    
    validateRequest(requestData: ICreateAccountRequest): void {
        
        const messages: string[] = [];

        if (requestData.emails.length == 0) {
            messages.push('At least one email must be provided');
        }

        if (!requestData.termsAgreed) {
            messages.push('The terms must be agreed to');
        }

        if (messages.length !== 0) {
            throw new ValidationError(requestData, messages);
        }
    }

    mapValidRequest(requestData: ICreateAccountRequest): any {
        return {
            contact: requestData.emails.map(r => `mailto:${r}`),
            onlyReturnExisting: false,
            termsOfServiceAgreed: requestData.termsAgreed
        };
    }

    async deserialise(response: Response): Promise<IAccountDetails> {
        const raw = await response.json();

        // TODO!
    }
    
    validateResponse(responseData: IAccountDetails): void {
        
        const messages: string[] = [];

        if (!responseData.accountId) {
            messages.push('No account id was obtained');
        }

        if (!responseData.secret) {
            messages.push('No account secret was obtained');
        }

        if (messages.length !== 0) {
            throw new ValidationError(responseData, messages);
        }
    }
}