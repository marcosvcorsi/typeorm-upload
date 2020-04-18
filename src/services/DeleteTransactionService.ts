import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checkIfTransationExists = await transactionsRepository.findOne(id);

    if (!checkIfTransationExists) {
      throw new AppError('Transaction was already deleted');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
