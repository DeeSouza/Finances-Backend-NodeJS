import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { transactions } = this;

    const balance = transactions.reduce(
      (sum, transaction) => {
        const { type, value } = transaction;

        if (sum[type]) sum[type] += value;
        else sum[type] = value;

        return sum;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error(
        'Não foi possível realizar essa ação porquê o valor da transação é superior ao que você possui no caixa.',
      );
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
