import { DataSource } from 'typeorm';

export async function seedNotifications(dataSource: DataSource): Promise<void> {
  const templates = [
    {
      name: 'Welcome Email',
      subject: 'Welcome to Delivery Platform!',
      type: 'EMAIL',
      category: 'WELCOME',
      isActive: true,
    },
    {
      name: 'Order Confirmation',
      subject: 'Your Order #{{orderId}} is Confirmed',
      type: 'EMAIL',
      category: 'ORDER',
      isActive: true,
    },
    {
      name: 'Delivery Update',
      subject: 'Your delivery is {{status}}',
      type: 'PUSH',
      category: 'DELIVERY',
      isActive: true,
    },
    {
      name: 'Payment Received',
      subject: 'Payment of ${{amount}} received',
      type: 'EMAIL',
      category: 'PAYMENT',
      isActive: true,
    },
    {
      name: 'Security Alert',
      subject: 'New login detected',
      type: 'SMS',
      category: 'SECURITY',
      isActive: true,
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO notification_templates (name, subject, type, category, "isActive", "createdAt", "updatedAt")
    VALUES ${templates.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, NOW(), NOW())`).join(',')}
    RETURNING id, name;
  `, templates.flatMap(t => [t.name, t.subject, t.type, t.category, t.isActive]));

  console.log(`   Created ${result.length} notification templates`);
}
