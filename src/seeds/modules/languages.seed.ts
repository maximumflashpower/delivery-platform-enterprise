import { DataSource } from 'typeorm';

export async function seedLanguages(dataSource: DataSource): Promise<void> {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', isActive: true },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isActive: true },
    { code: 'fr', name: 'French', nativeName: 'Français', isActive: true },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isActive: true },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', isActive: true },
    { code: 'zh', name: 'Chinese', nativeName: '中文', isActive: true },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', isActive: true },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isActive: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isActive: true },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isActive: true },
  ];

  const result = await dataSource.manager.query(`
    INSERT INTO languages (code, name, "nativeName", "isActive", "createdAt", "updatedAt")
    VALUES ${languages.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, NOW(), NOW())`).join(',')}
    RETURNING code, name;
  `, languages.flatMap(l => [l.code, l.name, l.nativeName, l.isActive]));

  console.log(`   Created ${result.length} supported languages`);
}
