export enum TestStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  BLOCKED = 'blocked',
}

export enum AttackVector {
  PROMPT_INJECTION = 'prompt_injection',
  JAILBREAK = 'jailbreak',
  DATA_EXTRACTION = 'data_extraction',
  ADVERSARIAL_INPUT = 'adversarial_input',
  MODEL_INVERSION = 'model_inversion',
  POISONING = 'poisoning',
  JAILBREAK_DAN = 'jailbreak_dan',
  ROLE_CONFUSION = 'role_confusion',
}

export enum SeverityLevel {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum FindingType {
  LEAKED_PII = 'leaked_pii',
  HARMFUL_CONTENT = 'harmful_content',
  POLICY_VIOLATION = 'policy_violation',
  BIAS_DETECTED = 'bias_detected',
  HALLUCINATION = 'hallucination',
  SECURITY_BYPASS = 'security_bypass',
  DATA_EXFILTRATION = 'data_exfiltration',
}
