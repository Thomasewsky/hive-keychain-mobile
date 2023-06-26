export interface SwapStep {
  step: SwapStepType;
  estimate: number;
  startToken: string;
  endToken: string;
  provider: string;
}

export enum SwapStepType {
  DEPOSIT_TO_HIVE_ENGINE = 'DEPOSIT_TO_HIVE_ENGINE',
  WITHDRAWAL_FROM_HIVE_ENGINE = 'WITHDRAWAL_FROM_HIVE_ENGINE',
  CONVERT_INTERNAL_MARKET = 'CONVERT_INTERNAL_MARKET',
  SWAP_TOKEN = 'SWAP',
  BUY_ON_HIVE_ENGINE_MARKET = 'BUY_ON_HIVE_ENGINE_MARKET',
  SELL_ON_HIVE_ENGINE_MARKET = 'SELL_ON_HIVE_ENGINE_MARKET',
  BUY_ON_MARKET = 'BUY_ON_MARKET',
  SELL_ON_MARKET = 'SELL_ON_MARKET',
}

export enum SwapStatus {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  CANCELED_DUE_TO_ERROR = 'CANCELED_DUE_TO_ERROR',
  REFUNDED_SLIPPAGE = 'REFUND_SLIPPAGE',
  REFUNDED_CANNOT_COMPLETE = 'REFUNDED_CANNOT_COMPLETE',
  COMPLETED = 'COMPLETED',
  FUNDS_RETURNED = 'FUNDS_RETURNED',
}

export interface Swap {
  id: string;
  username: string;
  startToken: string;
  endToken: string;
  amount: string;
  estimatedFinalAmount: string;
  slipperage: number;
  status: SwapStatus;
  steps: Step[];
  history: HistoryStep[];
  received: number;
  fee: string;
  updatedAt: Date;
  createdAt: Date;
  expectedAmountAfterFee: number;
  expectedAmountBeforeFee: number;
  transferInitiated: boolean;
  finalAmount: string;
}

export interface Step {
  id: number;
  type: SwapStepType;
  stepNumber: number;
  estimate: number;
  startToken: string;
  endToken: string;
  provider: Provider;
}

export interface HistoryStep {
  stepNumber: number;
  startToken: string;
  amountStartToken: number;
  amountEndToken: number;
  endToken: string;
  type: string;
  provider: string;
  status: string;
  transactionId: string;
}

export enum Provider {
  HIVE_INTERNAL_MARKET = 'HIVE_INTERNAL_MARKET',
  BEESWAP = 'BEESWAP',
  HIVE_PAY = 'HIVE_PAY',
  DISCOUNTED_BRIDGE = 'DISCOUNTED_BRIDGE',
  LEODEX = 'LEODEX',
  HIVE_ENGINE = 'HIVE_ENGINE',
  LIQUIDITY_POOL = 'LIQUIDITY_POOL',
  HIVE_ENGINE_INTERNAL_MARKET = 'HIVE_ENGINE_INTERNAL_MARKET',
}

export interface SwapConfig {
  account: string;
  fee: SwapFeeConfig;
  slippage: SwapSlippageConfig;
}

interface SwapFeeConfig {
  account: string;
  amount: number;
}

interface SwapSlippageConfig {
  min: number;
  default: number;
}
