import { DbContext } from '../../../database/db-context';
import { ISubmitChallengeRequest, ISubmitChallengeResponse } from '../../interfaces/challenge';
import { OperationBase, ValidationError } from '@ne1410s/http';
import { Acme2Service } from '../../../acme-core/services/acme2';
import { IFulfilmentData, IChallengeDetail } from '../../../acme-core/interfaces/challenge/base';

export class SubmitChallengeOperation extends OperationBase<
  ISubmitChallengeRequest,
  ISubmitChallengeResponse
> {
  constructor(private readonly db: DbContext) {
    super();
  }

  validateRequest(requestData: ISubmitChallengeRequest): void {}
  validateResponse(responseData: ISubmitChallengeResponse): void {}

  protected async invokeInternal(
    requestData: ISubmitChallengeRequest
  ): Promise<ISubmitChallengeResponse> {
    const db_order = (await this.db.Order.findOne({
      where: { OrderID: requestData.orderId },
      include: [
        {
          model: this.db.Account,
          where: { UserID: requestData.authenticUserId },
        },
      ],
    })) as any;

    if (!db_order) {
      console.error('No matching order found:', requestData);
      throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
    }

    const keys = JSON.parse(db_order.Account.JWKPair),
      env = db_order.Account.IsTest ? 'staging' : 'production',
      svc = new Acme2Service(env as any),
      token_response = await svc.tokens.get.invoke();

    const svc_response = await svc.challenges.fulfil.invoke({
      accountId: db_order.AccountID,
      token: token_response.token,
      keys,
      challengeDetail: {
        challengeId: requestData.challengeId,
        authCode: requestData.authCode,
        fulfilmentData: { keyAuth: requestData.keyAuth } as IFulfilmentData,
      } as IChallengeDetail,
    });

    let pollStatusOutcome = svc_response.status,
      pollCount = 0,
      svc_challenges;

    while (pollStatusOutcome === 'pending' && ++pollCount <= 5) {
      svc_challenges = await svc.challenges.list.invoke({
        authCode: requestData.authCode,
      });
      pollStatusOutcome = svc_challenges.status;
    }

    return {
      outcome: pollStatusOutcome,
    };
  }
}
