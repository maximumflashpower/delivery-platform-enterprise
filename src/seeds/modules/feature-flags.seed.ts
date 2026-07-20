import { DataSource } from 'typeorm';

export async function seedFeatureFlags(dataSource: DataSource): Promise<void> {
  const flags = [
    {
      name: 'New Dashboard UI',
      key: 'new_dashboard_ui',
      description: 'Enable redesigned dashboard interface',
      enabled: true,
      rolloutPercentage: 100,
    },
    {
      name: 'Dark Mode',
      key: 'dark_mode',
      description: 'Allow users to switch to dark theme',
      enabled: true,
      rolloutPercentage: 100,
    },
    {
      name: 'AI Chat Assistant',
      key: 'ai_chat_assistant',
      description: 'Beta AI-powered customer support chatbot',
      enabled: true,
      rolloutPercentage: 50,
    },
    {
      name: 'Voice Commands',
      key: 'voice_commands',
      description: 'Voice-based navigation and commands',
      enabled: false,
      rolloutPercentage: 0,
    },
    {
      name: 'Crypto Payments',
      key: 'crypto_payments',
      description: 'Accept cryptocurrency for transactions',
      enabled: true,
      rolloutPercentage: 25,
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO feature_flags (name, key, description, enabled, "rolloutPercentage", "createdAt", "updatedAt")
    VALUES ${flags.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, NOW(), NOW())`).join(',')}
    RETURNING id, name, key;
  `, flags.flatMap(f => [f.name, f.key, f.description, f.enabled, f.rolloutPercentage]));

  console.log(`   Created ${result.length} feature flags`);
}
