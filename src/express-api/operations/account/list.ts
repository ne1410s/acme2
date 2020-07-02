import { OperationBase } from '@ne1410s/http';
import { SecureRequest } from '../../web-models/auth';
import { AccountMeta } from '../../web-models/account';
import { DbContext } from '../../../database/db-context';

export class ListAccountsOperation extends OperationBase<SecureRequest, Array<AccountMeta>> {
  constructor(private readonly db: DbContext) {
    super(SecureRequest, AccountMeta as any);
  }

  protected async invokeInternal(requestData: SecureRequest): Promise<AccountMeta[]> {
    const db_accounts = await this.db.Account.findAll({
      where: { UserID: requestData.authenticUserId },
      include: [{ model: this.db.Order }],
    });

    return db_accounts.map((acc: any) => ({
      accountId: acc.AccountID,
      emails: JSON.parse(acc.Emails),
      isTest: acc.IsTest,
      orders: acc.Orders.map((ord: any) => ({
        orderId: ord.OrderID,
        accountId: ord.AccountID,
        domains: JSON.parse(ord.Domains),
      })),
    }));
  }
}
