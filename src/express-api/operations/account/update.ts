import { OperationBase, ValidationError } from '@ne1410s/http';
import { UpdateAccountRequest, AccountMeta } from '../../web-models/account';
import { DbContext } from '../../../database/db-context';
import { Acme2Service } from '../../../acme-core/services/acme2';

export class UpdateAccountOperation extends OperationBase<UpdateAccountRequest, AccountMeta> {
  constructor(private readonly db: DbContext) {
    super(UpdateAccountRequest, AccountMeta);
  }

  protected async invokeInternal(requestData: UpdateAccountRequest): Promise<AccountMeta> {
    const db_account = (await this.db.Account.findByPk(requestData.accountId)) as any;

    if (
      !db_account ||
      db_account.UserID !== requestData.authenticUserId ||
      db_account.IsTest !== requestData.isTest
    ) {
      console.error('No matching account found:', requestData);
      throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
    }

    const env = db_account.IsTest ? 'staging' : 'production',
      svc = new Acme2Service(env as any),
      token_response = await svc.tokens.get.invoke();

    const svc_account = await svc.accounts.update.invoke({
      token: token_response.token,
      accountId: requestData.accountId,
      emails: requestData.emails,
      keys: JSON.parse(db_account.JWKPair),
    });

    const outEmails = svc_account.contacts.map((c) => c.replace('mailto:', ''));

    await this.db.Account.update(
      { Emails: JSON.stringify(outEmails) },
      { where: { AccountID: db_account.AccountID } }
    );

    return {
      accountId: requestData.accountId,
      isTest: db_account.IsTest,
      emails: outEmails,
    } as AccountMeta;
  }
}
