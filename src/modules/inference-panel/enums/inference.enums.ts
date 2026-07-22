export enum InferenceType {
  RECOMMENDATION = 'recommendation',
  CLASSIFICATION = 'classification',
  RANKING = 'ranking',
  PREDICTION = 'prediction',
  GENERATION = 'generation',
  EMBEDDING = 'embedding',
  CLUSTERING = 'clustering',
}

export enum InferenceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CACHED = 'cached',
}

export enum PrivacyBudgetPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum BudgetStatus {
  ACTIVE = 'active',
  EXHAUSTED = 'exhausted',
  PAUSED = 'paused',
  EXPIRED = 'expired',
}

export enum TransactionType {
  CONSUMPTION = 'consumption',
  REFUND = 'refund',
  ALLOCATION = 'allocation',
  ADJUSTMENT = 'adjustment',
}

export enum DataSensitivity {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}
