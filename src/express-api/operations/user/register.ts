import { OperationBase, ValidationError } from '@ne1410s/http';
import * as apiConfig from '../../../api.json';
import { CaptchaRequest, AuthEntryResponse } from '../../web-models/auth';
import { DbContext } from '../../../database/db-context';
import { AuthUtils } from '../../utils/auth';

export class RegisterOperation extends OperationBase<CaptchaRequest, AuthEntryResponse> {
  constructor(private readonly db: DbContext) {
    super(CaptchaRequest, AuthEntryResponse);
  }

  protected async invokeInternal(requestData: CaptchaRequest): Promise<AuthEntryResponse> {
    await AuthUtils.validateRecaptcha(requestData.recaptcha, 'register');

    const result = await this.db.User.findAll({
      where: { UserName: requestData.username },
    });

    if (result.length != 0) {
      throw new ValidationError('The request is invalid', requestData, [
        'The username is not available',
      ]);
    }

    const hashResult = await AuthUtils.getHash(requestData.password);

    const newUser: any = await this.db.User.create({
      UserID: 0,
      UserName: requestData.username,
      PasswordHash: hashResult.hash,
      PasswordSalt: hashResult.salt,
      LastActivity: new Date(),
    });

    return {
      token: AuthUtils.getToken(newUser.UserID, apiConfig.tokenMinutes),
      lifetime: apiConfig.tokenMinutes * 60 * 1000,
    };
  }
}
