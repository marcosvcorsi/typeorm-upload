/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[] | null> {
    const createTransactionService = new CreateTransactionService();
    const transactions: Transaction[] = [];

    const fileContent = await fs.promises.readFile(
      path.join(uploadConfig.directory, filename),
      'utf-8',
    );

    const lines = fileContent.trim().split('\n');
    lines.splice(0, 1);

    for (const line of lines) {
      const [title, type, value, category] = line.split(', ');

      const transaction = await createTransactionService.execute({
        title: String(title),
        type: String(type),
        value: Number(value),
        category: String(category),
      } as TransactionCSV);

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
