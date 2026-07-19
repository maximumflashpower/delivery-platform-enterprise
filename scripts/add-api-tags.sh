#!/bin/bash
cd ~/projects/delivery-platform-enterprise

# Mapeo de directorios a tags
declare -A TAG_MAP=(
    ["auth"]="Auth"
    ["identity"]="Identity"
    ["financial"]="Financial"
    ["payout"]="Financial"
    ["governance"]="Governance"
    ["chat"]="Chat"
    ["wellness"]="Wellness"
    ["ml"]="ML"
    ["feature-flag"]="Feature Flags"
    ["notification"]="Notifications"
    ["analytics"]="Analytics"
    ["observability"]="Observability"
    ["sustainability"]="Sustainability"
    ["gamification"]="Gamification"
    ["smart-contract"]="Blockchain"
    ["accessibility"]="Accessibility"
    ["integration"]="Integration"
    ["realtime"]="Realtime"
    ["search"]="Search"
    ["schedule"]="Scheduling"
    ["domain_drivers"]="Logistics - Drivers"
    ["domain_couriers"]="Logistics - Couriers"
    ["domain_haulers"]="Logistics - Freight"
    ["domain_carriers"]="Logistics - Shipping"
    ["domain_claims"]="Logistics - Claims"
    ["domain_service"]="Logistics - Services"
    ["domain_merchants"]="Commerce - Merchants"
    ["domain_hosts"]="Travel - Hosts"
    ["admin"]="Admin"
    ["configuration"]="Configuration"
    ["audit"]="Audit"
    ["storage"]="Files"
    ["rate-limit"]="Rate Limiting"
    ["language"]="Languages"
)

for controller in src/modules/*/controllers/*.controller.ts; do
    if [ ! -f "$controller" ]; then continue; fi
    
    # Extraer nombre del módulo
    module_name=$(dirname "$controller" | xargs dirname | xargs basename)
    
    # Buscar tag correspondiente
    tag=""
    for key in "${!TAG_MAP[@]}"; do
        if [[ "$module_name" == *"$key"* ]]; then
            tag="${TAG_MAP[$key]}"
            break
        fi
    done
    
    # Si no encontró, usar módulo capitalizado
    if [ -z "$tag" ]; then
        tag=$(echo "$module_name" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
    fi
    
    # Verificar si ya tiene @ApiTags
    if grep -q "@ApiTags" "$controller"; then
        echo "✓ Already tagged: $controller"
        continue
    fi
    
    # Agregar import de ApiTags
    sed -i "1s/^/import { ApiTags } from '@nestjs\\/swagger';\\n/" "$controller"
    
    # Agregar @ApiTags justo después del último decorator @Controller
    line_num=$(grep -n "@Controller" "$controller" | tail -1 | cut -d: -f1)
    if [ -n "$line_num" ]; then
        sed -i "${line_num}s/@Controller/@ApiTags('$tag')\\n@Controller/" "$controller"
        echo "✓ Tagged $controller with [$tag]"
    fi
done

echo "Done!"
