#!/bin/bash

echo "=============================================="
echo "🌱 DELIVERY PLATFORM - SEED DATA INITIALIZATION"
echo "=============================================="
echo ""

# Compilar TypeScript primero
echo "⏳ Compiling TypeScript..."
npm run build > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed. Check errors above."
    exit 1
fi

echo "✅ Compilation successful"
echo ""

# Ejecutar seeds
echo "🚀 Running seed scripts..."
echo ""

node dist/seeds/main.seed.js

echo ""
echo "=============================================="
echo "✨ SEEDING COMPLETE!"
echo "=============================================="

# Mostrar conteo final
echo ""
echo "📊 Final Data Counts:"
echo "  Users: $(sqlite3 dev.db "SELECT COUNT(*) FROM identity_users;" 2>/dev/null || echo "N/A")"
echo "  Policies: $(sqlite3 dev.db "SELECT COUNT(*) FROM governance_policies;" 2>/dev/null || echo "N/A")"
echo "  Chat Rooms: $(sqlite3 dev.db "SELECT COUNT(*) FROM chat_rooms;" 2>/dev/null || echo "N/A")"
echo "  Wellness Goals: $(sqlite3 dev.db "SELECT COUNT(*) FROM wellness_goals;" 2>/dev/null || echo "N/A")"
echo "  ML Models: $(sqlite3 dev.db "SELECT COUNT(*) FROM model_versions;" 2>/dev/null || echo "N/A")"
echo "  Feature Flags: $(sqlite3 dev.db "SELECT COUNT(*) FROM feature_flags;" 2>/dev/null || echo "N/A")"
echo "  Languages: $(sqlite3 dev.db "SELECT COUNT(*) FROM languages;" 2>/dev/null || echo "N/A")"

