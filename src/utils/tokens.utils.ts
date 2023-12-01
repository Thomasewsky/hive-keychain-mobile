import {TokenBalance} from 'actions/interfaces';
import hsc, {hiveEngineGet} from 'api/hiveEngine';
import {Token} from 'src/interfaces/tokens.interface';

export interface TransactionConfirmationResult {
  confirmed: boolean;
  error: any;
}

const tryConfirmTransaction = (
  trxId: string,
): Promise<TransactionConfirmationResult> => {
  let result: any;
  return new Promise(async function (fulfill, reject) {
    for (let i = 0; i < 20; i++) {
      result = await BlockchainTransactionUtils.getDelayedTransactionInfo(
        trxId,
      );
      if (result != null) break;
    }

    var error = null;
    if (result && result.logs) {
      var logs = JSON.parse(result.logs);

      if (logs.errors && logs.errors.length > 0) error = logs.errors[0];
    }

    fulfill({confirmed: result != null, error: error});
  });
};

const getDelayedTransactionInfo = (trxID: string) => {
  return new Promise(function (fulfill, reject) {
    setTimeout(async function () {
      fulfill(hsc.getTransactionInfo(trxID));
    }, 1000);
  });
};
/* istanbul ignore next */
const delayRefresh = async (): Promise<void> => {
  const TIME_REFERENCE = 1643236071000;
  const delay = Math.min(
    ((Date.now() - TIME_REFERENCE) % 3) * 1000 + 100,
    3000,
  );
  return new Promise(function (fulfill, reject) {
    setTimeout(() => {
      fulfill();
    }, delay);
  });
};

export const getUserBalance = (account: string) => {
  return hiveEngineGet<TokenBalance[]>({
    contract: 'tokens',
    table: 'balances',
    query: {account: account},
    indexes: [],
    limit: 1000,
    offset: 0,
  });
};

export const getAllTokens = async (): Promise<Token[]> => {
  let tokens = [];
  let offset = 0;
  do {
    const newTokens = await getTokens(offset);
    tokens.push(...newTokens);
    offset += 1000;
  } while (tokens.length % 1000 === 0);
  return tokens;
};

const getTokens = async (offset: number) => {
  return (
    await hiveEngineGet<any[]>({
      contract: 'tokens',
      table: 'tokens',
      query: {},
      limit: 1000,
      offset: offset,
      indexes: [],
    })
  ).map((t: any) => {
    return {
      ...t,
      metadata: JSON.parse(t.metadata),
    };
  });
};

export const BlockchainTransactionUtils = {
  tryConfirmTransaction,
  delayRefresh,
  getDelayedTransactionInfo,
};
