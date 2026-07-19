#!/bin/bash
FILE="src/main.ts"

# Insertar después de la línea de SwaggerModule.setup()
sed -i "/SwaggerOptions: {$/a\\
    const apiJsonDocs = SwaggerModule.createDocument(app, swaggerConfig);" "$FILE"

# Mejor enfoque: agregar router explícito
cat >> /tmp/swagger-fix.txt << 'EOF'
// Expose Swagger JSON endpoint
app.get('/docs-json', (req, res) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  res.json(document);
});
EOF

echo "Fix creado. Aplicar manualmente o revisa el contenido:"
cat /tmp/swagger-fix.txt
