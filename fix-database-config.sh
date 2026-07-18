#!/bin/bash

# Backup primero
cp src/app.module.ts src/app.module.ts.backup

# Agregar import de databaseConfig después de la primera línea
sed -i '/^import/,/^const/{ /^[[:space:]]*$/a\
import databaseConfig from '\''./config/database.config'\'';\
}' src/app.module.ts

# Reemplazar TypeOrmModule.forRoot({ con TypeOrmModule.forRootAsync que use databaseConfig
# O más simple - reemplazar directamente
sed -i 's/TypeOrmModule\.forRoot({[^}]*})/TypeOrmModule.forRoot(databaseConfig)/' src/app.module.ts

echo "App module updated"
cat src/app.module.ts | head -30
