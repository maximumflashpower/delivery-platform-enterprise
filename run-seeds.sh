#!/bin/bash

echo "=============================================="
echo "🌱 DELIVERY PLATFORM - SEED DATA INITIALIZATION"
echo "=============================================="
echo ""

# Verificar que dev.db existe
if [ ! -f "dev.db" ]; then
    echo "❌ dev.db not found. Start the app first with: npm run start:dev"
    exit 1
fi

# Ejecutar SQL seed
echo "🚀 Inserting seed data into dev.db..."
sqlite3 dev.db < infrastructure/database/seeds/seed-dev.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data inserted successfully!"
else
    echo "❌ Failed to insert seed data"
    exit 1
fi

# Mostrar conteo
echo ""
echo "📊 Final Data Counts:"
echo "  Users:          $(sqlite3 dev.db "SELECT COUNT(*) FROM identity_users;" 2>/dev/null || echo "table not found")"
echo "  Policies:       $(sqlite3 dev.db "SELECT COUNT(*) FROM governance_policies;" 2>/dev/null || echo "table not found")"
echo "  Chat Rooms:     $(sqlite3 dev.db "SELECT COUNT(*) FROM chat_rooms;" 2>/dev/null || echo "table not found")"
echo "  Wellness Goals: $(sqlite3 dev.db "SELECT COUNT(*) FROM wellness_goals;" 2>/dev/null || echo "table not found")"
echo "  ML Models:      $(sqlite3 dev.db "SELECT COUNT(*) FROM model_versions;" 2>/dev/null || echo "table not found")"
echo "  Feature Flags:  $(sqlite3 dev.db "SELECT COUNT(*) FROM feature_flags;" 2>/dev/null || echo "table not found")"
echo "  Languages:      $(sqlite3 dev.db "SELECT COUNT(*) FROM languages;" 2>/dev/null || echo "table not found")"
echo "  Notifications:  $(sqlite3 dev.db "SELECT COUNT(*) FROM notification_templates;" 2>/dev/null || echo "table not found")"
echo "  Audit Logs:     $(sqlite3 dev.db "SELECT COUNT(*) FROM audit_logs;" 2>/dev/null || echo "table not found")"
echo ""
echo "=============================================="
echo "✨ SEEDING COMPLETE!"
echo "=============================================="
