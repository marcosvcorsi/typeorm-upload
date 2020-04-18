import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = this.getTotal(transactions, 'income');
    const outcome = this.getTotal(transactions, 'outcome');

    const total = income - outcome;

    return { income, outcome, total };
  }

  private getTotal(transactions: Transaction[], type: string): number {
    return transactions.reduce((total, item) => {
      if (item.type === type) {
        return total + item.value;
      }

      return total;
    }, 0);
  }
}

export default TransactionsRepository;
