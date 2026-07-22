export enum ConsentPurpose {
  MARKETING = 'marketing',
  PERSONALIZATION = 'personalization',
  ANALYTICS = 'analytics',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  COOKIES = 'cookies',
  DATA_PROCESSING = 'data_processing',
  COMMUNICATIONS = 'communications',
  SECURITY = 'security',
}

export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export enum ConsentMethod {
  WEB_FORM = 'web_form',
  MOBILE_APP = 'mobile_app',
  API = 'api',
  EMAIL = 'email',
  PHONE = 'phone',
  PHYSICAL = 'physical',
}

export enum PreferenceCategory {
  COMMUNICATIONS = 'communications',
  NOTIFICATIONS = 'notifications',
  PRIVACY = 'privacy',
  ACCESSIBILITY = 'accessibility',
  LOCALIZATION = 'localization',
  THEME = 'theme',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook',
}

export enum CommunicationType {
  PROMOTIONAL = 'promotional',
  TRANSACTIONAL = 'transactional',
  ALERT = 'alert',
  NEWSLETTER = 'newsletter',
  SURVEY = 'survey',
  UPDATE = 'update',
}
