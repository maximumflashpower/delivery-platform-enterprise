export const AD_CATEGORIES = [
  'commercial',
  'political',
  'sponsored_content',
  'affiliate',
  'behavioral',
  'contextual',
] as const;
export type AdCategory = (typeof AD_CATEGORIES)[number];

export const CONSENT_TYPES = [
  'personalized',
  'frequency_capping',
  'behavioral_targeting',
  'third_party_sharing',
] as const;
export type ConsentType = (typeof CONSENT_TYPES)[number];

export const CONSENT_METHODS = [
  'explicit_opt_in',
  'implicit_consent',
  'default_opt_out',
  'cookie_banner',
] as const;
export type ConsentMethod = (typeof CONSENT_METHODS)[number];

export const SETTING_DATA_TYPES = ['string', 'boolean', 'integer', 'json'] as const;
export type SettingDataType = (typeof SETTING_DATA_TYPES)[number];

export const SETTING_CATEGORIES = [
  'targeting',
  'frequency',
  'privacy',
  'transparency',
  'disclosure',
] as const;
export type SettingCategory = (typeof SETTING_CATEGORIES)[number];

export const DEFAULT_AD_CATEGORIES = [...AD_CATEGORIES];
