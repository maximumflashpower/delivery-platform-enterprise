import { DataSource } from 'typeorm';

export async function seedMLModels(dataSource: DataSource): Promise<void> {
  const models = [
    {
      name: 'Route Optimization Engine',
      version: 'v2.3.1',
      type: 'OPTIMIZATION',
      framework: 'TensorFlow',
      accuracy: 0.94,
      status: 'DEPLOYED',
      trainedDate: new Date('2024-05-15'),
    },
    {
      name: 'Demand Prediction Model',
      version: 'v1.8.0',
      type: 'PREDICTION',
      framework: 'PyTorch',
      accuracy: 0.89,
      status: 'DEPLOYED',
      trainedDate: new Date('2024-04-20'),
    },
    {
      name: 'Fraud Detection System',
      version: 'v3.1.2',
      type: 'CLASSIFICATION',
      framework: 'XGBoost',
      accuracy: 0.97,
      status: 'DEPLOYED',
      trainedDate: new Date('2024-06-01'),
    },
    {
      name: 'Customer Segmentation',
      version: 'v1.2.0',
      type: 'CLUSTERING',
      framework: 'Scikit-learn',
      accuracy: 0.86,
      status: 'STAGING',
      trainedDate: new Date('2024-06-10'),
    },
    {
      name: 'Price Elasticity Model',
      version: 'v2.0.0',
      type: 'REGRESSION',
      framework: 'TensorFlow',
      accuracy: 0.91,
      status: 'DEPLOYED',
      trainedDate: new Date('2024-03-25'),
    },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO model_versions (name, version, type, framework, accuracy, status, "trainedDate", "createdAt", "updatedAt")
    VALUES ${models.map((_, i) => `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, NOW(), NOW())`).join(',')}
    RETURNING id, name, version;
  `, models.flatMap(m => [m.name, m.version, m.type, m.framework, m.accuracy, m.status, m.trainedDate]));

  console.log(`   Created ${result.length} ML model versions`);
}
