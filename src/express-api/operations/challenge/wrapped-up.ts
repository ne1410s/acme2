import { DbContext } from '../../../database/db-context';
import { SubmitChallengeOperation } from './submit';

export class ChallengeOperations {
  public readonly submit: SubmitChallengeOperation;

  constructor(db: DbContext) {
    this.submit = new SubmitChallengeOperation(db);
  }
}
