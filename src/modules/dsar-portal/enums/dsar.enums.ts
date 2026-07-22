export enum DsarRequestType {
  ACCESS = 'access',
  EXPORT = 'export',
  DELETION = 'deletion',
  RECTIFICATION = 'rectification',
  PORTABILITY = 'portability',
  OBJECTION = 'objection',
}

export enum DsarRequestStatus {
  SUBMITTED = 'submitted',
  IDENTITY_VERIFIED = 'identity_verified',
  IN_REVIEW = 'in_review',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum DsarPriority {
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum DeletionScopeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

export enum DataCategory {
  PROFILE = 'profile',
  SESSIONS = 'sessions',
  DEVICES = 'devices',
  CONSENTS = 'consents',
  PREFERENCES = 'preferences',
  SEARCH_HISTORY = 'search_history',
  ANALYTICS = 'analytics',
  NOTIFICATIONS = 'notifications',
  TRANSACTIONS = 'transactions',
  GOVERNANCE = 'governance',
  SUPPORT_CASES = 'support_cases',
  BIOMETRIC = 'biometric',
  AUDIT_LOGS = 'audit_logs',
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}

export enum ExportJobStatus {
  QUEUED = 'queued',
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
  EXPIRED = 'expired',
}
