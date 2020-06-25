import { ListChallengesOperation } from './list';
import { GetChallengeDetailOperation } from './get-detail';
import { FulfilChallengeOperation } from './fulfil';

export class ChallengeOperations {
  public readonly list: ListChallengesOperation;
  public readonly detail: GetChallengeDetailOperation;
  public readonly fulfil: FulfilChallengeOperation;

  constructor(baseUrl: string) {
    this.list = new ListChallengesOperation(baseUrl);
    this.detail = new GetChallengeDetailOperation();
    this.fulfil = new FulfilChallengeOperation(baseUrl);
  }
}
