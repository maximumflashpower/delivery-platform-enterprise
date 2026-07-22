WO-020: Panel de Inferencias y Presupuesto de Privacidad

Estado: ✅ Implementado
Fecha: Julio 2026
Módulos: ml-pipeline, analytics (secundario: privacy-consent)
Resumen

Sistema para gestionar inferencias de ML sobre usuarios con control de presupuesto de privacidad y límites de uso.
Funcionalidades

    Inference Registry: Catálogo de modelos de inferencia disponibles
    Privacy Budget: Límites configurables de inferencias por usuario
    Usage Tracking: Conteo de inferencias contra el presupuesto
    Opt-out Granular: Usuarios pueden bloquear inferencias específicas
    Explainability: Explicación de qué datos generan cada inferencia

Endpoints Implementados
Método	Endpoint	Descripción
GET	/api/inference/model-inferences	Listar inferencias activas
POST	/api/inference/model-inferences	Registrar nueva inferencia
GET	/api/inference/model-inferences/:id	Detalle de inferencia
PUT	/api/inference/model-inferences/:id	Actualizar configuración
DELETE	/api/inference/model-inferences/:id	Desactivar inferencia
GET	/api/inference/user-budget/:userId	Presupuesto de usuario
POST	/api/inference/user-budget/:userId	Actualizar presupuesto
GET	/api/inference/user-inferences/:userId	Inferencias del usuario
Entidades TypeORM

    InferenceModel: Modelo de inferencia, descripciones, categorías
    UserInferenceBudget: Presupuesto y límites por usuario

Integración

    Registrado en app.module.ts como InferencePanelModule
    Se conecta con ml-pipeline para ejecutar inferencias
    Se conecta con privacy-consent para respetar preferencias

Smoke Test Exitoso
GET /api/inference/model-inferences
→ [] (vacío, listo para uso)

