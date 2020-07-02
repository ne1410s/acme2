import { OperationBase, ValidationError } from '@ne1410s/http';
import { OrderRequest } from '../../web-models/order';
import { DbContext } from '../../../database/db-context';

export class DeleteOrderOperation extends OperationBase<OrderRequest, {}> {
  constructor(private readonly db: DbContext) {
    super(OrderRequest);
  }

  protected async invokeInternal(requestData: OrderRequest): Promise<{}> {
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

    await this.db.Order.destroy({
      where: { OrderID: requestData.orderId },
    });

    return Promise.resolve({});
  }
}
