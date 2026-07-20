import { DataSource } from 'typeorm';

export async function seedChat(dataSource: DataSource): Promise<void> {
  const rooms = [
    {
      name: 'General Discussion',
      description: 'Main channel for platform-wide announcements and general conversation',
      type: 'PUBLIC',
      maxParticipants: 1000,
      isActive: true,
    },
    {
      name: 'Driver Support',
      description: 'Help and support channel for drivers',
      type: 'PUBLIC',
      maxParticipants: 500,
      isActive: true,
    },
    {
      name: 'Merchant Partnerships',
      description: 'Coordination channel for merchant onboarding and partnerships',
      type: 'PRIVATE',
      maxParticipants: 50,
      isActive: true,
    },
    {
      name: 'Technical Issues',
      description: 'Bug reports, feature requests, and technical troubleshooting',
      type: 'PUBLIC',
      maxParticipants: 1000,
      isActive: true,
    },
    {
      name: 'Executive Team',
      description: 'Internal executive decision-making channel',
      type: 'RESTRICTED',
      maxParticipants: 15,
      isActive: true,
    },
    {
      name: 'Customer Feedback',
      description: 'Collect and discuss customer reviews and suggestions',
      type: 'PUBLIC',
      maxParticipants: 200,
      isActive: true,
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO chat_rooms (name, description, type, "maxParticipants", "isActive", "createdAt", "updatedAt")
    VALUES ${rooms.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, NOW(), NOW())`).join(',')}
    RETURNING id, name;
  `, rooms.flatMap(r => [r.name, r.description, r.type, r.maxParticipants, r.isActive]));

  console.log(`   Created ${result.length} chat rooms`);
}
