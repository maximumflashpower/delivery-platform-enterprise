#!/bin/bash

fix_module() {
  file=$1
  service=$2
  
  echo "📝 Fixing $file"
  
  # Verificar si ya exporta
  if ! grep -q "exports: \[$service\]" "$file" && ! grep -q "exports: \[.*$service" "$file"; then
    # Insertar después de providers: [...]
    sed -i "/^  providers: \[$/,/^\],$/ s/^\],$/  exports: \[$service\],\n\]/" "$file"
    echo "  ✓ Added exports"
  else
    echo "  ℹ Already exported"
  fi
}

fix_module "src/modules/governance/governance.module.ts" "GovernancePolicyService"
fix_module "src/modules/chat/chat.module.ts" "ChatRoomService"
fix_module "src/modules/wellness/wellness.module.ts" "WellnessGoalService"
fix_module "src/modules/integration-gateway/integration-gateway.module.ts" "ApiKeyService"
fix_module "src/modules/ml-pipeline/ml-pipeline.module.ts" "ModelVersionService"

echo "✅ Done"
