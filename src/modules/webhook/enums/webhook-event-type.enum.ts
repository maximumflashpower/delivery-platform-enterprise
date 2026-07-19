export enum WebhookEventType {
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CANCELLED = 'order.cancelled',
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_FAILED = 'payment.failed',
  SHIPMENT_DISPATCHED = 'shipment.dispatched',
  SHIPMENT_DELIVERED = 'shipment.delivered',
  USER_REGISTERED = 'user.registered',
  USER_VERIFIED = 'user.verified',
  CLAIM_OPENED = 'claim.opened',
  CLAIM_RESOLVED = 'claim.resolved',
  MERCHANT_APPROVED = 'merchant.approved',
}
