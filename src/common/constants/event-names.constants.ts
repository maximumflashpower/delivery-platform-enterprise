export const EventNames = {
  // Ride events
  RIDE_REQUESTED: 'ride.requested',
  RIDE_ACCEPTED: 'ride.accepted',
  RIDE_STARTED: 'ride.started',
  RIDE_COMPLETED: 'ride.completed',
  RIDE_CANCELLED: 'ride.cancelled',
  RIDE_LOCATION_UPDATE: 'ride.location_update',

  // Driver events
  DRIVER_WENT_ONLINE: 'driver.went_online',
  DRIVER_WENT_OFFLINE: 'driver.went_offline',
  DRIVER_SHIFT_STARTED: 'driver.shift_started',
  DRIVER_SHIFT_ENDED: 'enter.shift_ended',
  DRIVER_DEPLOYMENT_RECOMMENDED: 'driver.deployment_recommended',

  // Financial events
  PAYMENT_PROCESSED: 'financial.payment_processed',
  PAYOUT_REQUESTED: 'financial.payout_requested',
  PAYOUT_COMPLETED: 'financial.payout_completed',
  PAYOUT_FAILED: 'financial.payout_failed',
  REFUND_ISSUED: 'financial.refund_issued',
  ESCROW_RELEASED: 'financial.escrow_released',

  // Trust/Safety events
  FRAUD_DETECTED: 'trust.fraud_detected',
  TRUST_SCORE_UPDATED: 'trust.score_updated',
  EMERGENCY_TRIGGERED: 'trust.emergency_triggered',
  AUDIO_INCIDENT: 'trust.audio_incident',

  // Governance events
  POLICY_VIOLATION: 'gov.policy_violation',
  COMPLIANCE_CHECK_FAILED: 'gov.compliance_failed',
  DRIFT_DETECTED: 'gov.drift_detected',

  // ML events
  MODEL_RETRAINED: 'ml.model_retrained',
  ANOMALY_DETECTED: 'ml.anomaly_detected',
  PREDICTION_GENERATED: 'ml.prediction_generated',

  // User events
  USER_REGISTERED: 'user.registered',
  USER_VERIFIED: 'user.verified',
  ROLE_SWITCHED: 'user.role_switched',

  // Notification events
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_READ: 'notification.read',
} as const;

export type EventName = (typeof EventNames)[keyof typeof EventNames];
