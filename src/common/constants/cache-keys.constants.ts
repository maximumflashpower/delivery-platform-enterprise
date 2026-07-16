export const CacheKeys = {
  // Identity
  USER_SESSION: (userId: string) => `session:${userId}`,
  USER_PROFILE: (userId: string) => `profile:${userId}`,
  USER_ROLE: (userId: string) => `role:${userId}`,

  // Mobility
  RIDE_ACTIVE: (rideId: string) => `ride:active:${rideId}`,
  RIDE_MATCHING_QUEUE: (zoneId: string) => `ride:matching:${zoneId}`,
  DRIVER_LOCATION: (driverId: string) => `driver:loc:${driverId}`,
  DRIVER_STATUS: (driverId: string) => `driver:status:${driverId}`,
  ZONE_DEMAND: (zoneId: string) => `zone:demand:${zoneId}`,

  // Financial
  WALLET_BALANCE: (userId: string) => `wallet:${userId}`,
  PAYOUT_DAILY_USED: (userId: string) => `payout:daily:${userId}:${new Date().toISOString().split('T')[0]}`,
  LEDGER_ENTRY: (entryId: string) => `ledger:${entryId}`,

  // ML
  DEMAND_PREDICTION: (zoneId: string) => `ml:demand:${zoneId}`,
  HEATMAP: (regionKey: string) => `ml:heatmap:${regionKey}`,
  BEHAVIORAL_BASELINE: (userId: string) => `ml:behavior:${userId}`,

  // Governance
  POLICY_ACTIVE: `gov:policies:active`,
  COMPLIANCE_FLAGS: (userId: string) => `gov:compliance:${userId}`,
  SERVICE_CATALOG: `gov:catalog`,

  // Rate Limiting
  RATE_LIMIT_API_KEY: (apiKey: string) => `rl:apikey:${apiKey}`,
  RATE_LIMIT_IP: (ip: string) => `rl:ip:${ip}`,
} as const;
