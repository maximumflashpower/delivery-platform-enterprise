import { DataSource } from 'typeorm';

export async function seedWellness(dataSource: DataSource): Promise<void> {
  const goals = [
    {
      title: 'Physical Activity Challenge',
      description: 'Complete 10,000 steps daily for 30 consecutive days',
      category: 'PHYSICAL',
      points: 500,
      durationDays: 30,
      isActive: true,
    },
    {
      title: 'Mindfulness Meditation',
      description: 'Practice 10 minutes of meditation daily for stress reduction',
      category: 'MENTAL',
      points: 300,
      durationDays: 21,
      isActive: true,
    },
    {
      title: 'Hydration Tracker',
      description: 'Drink at least 2 liters of water every day',
      category: 'PHYSICAL',
      points: 200,
      durationDays: 14,
      isActive: true,
    },
    {
      title: 'Sleep Quality Improvement',
      description: 'Maintain 7-8 hours of quality sleep nightly',
      category: 'HEALTH',
      points: 400,
      durationDays: 30,
      isActive: true,
    },
    {
      title: 'Nutrition Education',
      description: 'Complete 5 healthy eating lessons and apply learnings',
      category: 'NUTRITION',
      points: 600,
      durationDays: 60,
      isActive: true,
    },
    {
      title: 'Work-Life Balance',
      description: 'Take regular breaks and disconnect after work hours',
      category: 'MENTAL',
      points: 350,
      durationDays: 45,
      isActive: true,
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO wellness_goals (title, description, category, points, "durationDays", "isActive", "createdAt", "updatedAt")
    VALUES ${goals.map((_, i) => `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, NOW(), NOW())`).join(',')}
    RETURNING id, title;
  `, goals.flatMap(g => [g.title, g.description, g.category, g.points, g.durationDays, g.isActive]));

  console.log(`   Created ${result.length} wellness goals`);
}
