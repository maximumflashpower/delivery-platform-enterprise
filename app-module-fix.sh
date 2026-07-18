#!/bin/bash

# Backup
cp src/app.module.ts src/app.module.ts.backup

# Encontrar línea con load: [
LINE=$(grep -n "load: \[" src/app.module.ts | head -1 | cut -d: -f1)

# Remover databaseConfig de load
sed -i "${LINE}s/, *databaseConfig//" src/app.module.ts

# Encontrar TypeOrmModule.forRootAsync
TYPERM_LINE=$(grep -n "TypeOrmModule.forRootAsync" src/app.module.ts | head -1 | cut -d: -f1)

# Reemplazar entire forRootAsync block
cat > temp-typeorm.txt << 'EOF'
      TypeOrmModule.forRootAsync({
        inject: [TypeOrmConfigService],
        useClass: TypeOrmConfigService,
        useFactory: (cfg: TypeOrmConfigService) => cfg.getTypeOrmConfig(),
      }),
EOF

echo "TypeORM fix applied. Check src/app.module.ts manually."
