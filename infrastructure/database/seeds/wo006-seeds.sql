-- ============================================
-- WO-006 Seeds: Interest Signals, Ranking Models, Metrics
-- ============================================

-- Ranking Models
INSERT INTO ranking_models (id, name, strategy, status, description, weight_collaborative, weight_content, weight_popularity, weight_recency, weight_personalization, ml_model_ref, target_entity_type, accuracy_score, created_at, updated_at)
VALUES
  ('model-001-uuid-a1b2c3d4', 'Hybrid Delivery Ranking v1', 'hybrid', 'active', 'Hybrid model combining collaborative filtering, content signals, and popularity for delivery recommendations', 0.35, 0.25, 0.15, 0.10, 0.15, 'ml-pipeline:route-optimization-v3', 'delivery', 0.87, datetime('now'), datetime('now')),
  ('model-002-uuid-b2c3d4e5', 'Merchant Recommendation v1', 'collaborative', 'active', 'Collaborative filtering based merchant recommendations for B2B marketplace', 0.60, 0.20, 0.10, 0.05, 0.05, 'ml-pipeline:merchant-recommender-v1', 'merchant', 0.82, datetime('now'), datetime('now')),
  ('model-003-uuid-c3d4e5f6', 'Trending Services', 'trending', 'experimental', 'Trending services based on recency-weighted popularity', 0.10, 0.10, 0.50, 0.20, 0.10, NULL, 'service', 0.71, datetime('now'), datetime('now'));

-- Interest Signals
INSERT INTO interest_signals (id, user_id, entity_id, entity_type, signal_type, signal_source, weight, context, dwell_time_seconds, rating_value, search_query_text, created_at, updated_at)
VALUES
  ('sig-001-uuid-d4e5f6a7', 'user-uuid-001', 'delivery-001', 'delivery', 'view', 'organic', 1.0, 'homepage_feed', 45, NULL, NULL, datetime('now'), datetime('now')),
  ('sig-002-uuid-e5f6a7b8', 'user-uuid-001', 'delivery-001', 'delivery', 'purchase', 'organic', 5.0, 'checkout_flow', NULL, '5', NULL, datetime('now'), datetime('now')),
  ('sig-003-uuid-f6a7b8c9', 'user-uuid-001', 'merchant-001', 'merchant', 'view', 'search', 1.0, 'search_results', 30, NULL, 'restaurant near me', datetime('now'), datetime('now')),
  ('sig-004-uuid-a7b8c9d0', 'user-uuid-001', 'merchant-001', 'merchant', 'rate', 'organic', 3.0, 'post_purchase', NULL, '4', NULL, datetime('now'), datetime('now')),
  ('sig-005-uuid-b8c9d0e1', 'user-uuid-001', 'delivery-002', 'delivery', 'save', 'organic', 2.0, 'wishlist', NULL, NULL, NULL, datetime('now'), datetime('now')),
  ('sig-006-uuid-c9d0e1f2', 'user-uuid-002', 'delivery-001', 'delivery', 'view', 'recommended', 1.5, 'recommendation_feed', 60, NULL, NULL, datetime('now'), datetime('now')),
  ('sig-007-uuid-d0e1f2a3', 'user-uuid-002', 'delivery-003', 'delivery', 'purchase', 'push', 5.0, 'push_notification_campaign', NULL, '3', NULL, datetime('now'), datetime('now')),
  ('sig-008-uuid-e1f2a3b4', 'user-uuid-002', 'merchant-002', 'merchant', 'share', 'social', 2.5, 'social_share', NULL, NULL, NULL, datetime('now'), datetime('now')),
  ('sig-009-uuid-f2a3b4c5', 'user-uuid-003', 'service-001', 'service', 'view', 'search', 1.0, 'search_results', 120, NULL, 'home cleaning', datetime('now'), datetime('now')),
  ('sig-010-uuid-a3b4c5d6', 'user-uuid-003', 'service-001', 'service', 'bookmark', 'organic', 2.0, 'detail_page', NULL, NULL, NULL, datetime('now'), datetime('now'));

-- Ranking Metrics
INSERT INTO ranking_metrics (id, model_id, metric_type, value, previous_value, delta, time_window, sample_size, notes, created_at)
VALUES
  ('metric-001-uuid-b3c4d5e6', 'model-001-uuid-a1b2c3d4', 'ctr', 0.087, 0.082, 0.005, '7d', 15000, 'CTR improved after personalization weight increase', datetime('now')),
  ('metric-002-uuid-c4d5e6f7', 'model-001-uuid-a1b2c3d4', 'ndcg', 0.74, 0.71, 0.03, '7d', 15000, 'NDCG@10 improved with new collaborative weights', datetime('now')),
  ('metric-003-uuid-d5e6f7a8', 'model-001-uuid-a1b2c3d4', 'conversion_rate', 0.034, 0.029, 0.005, '7d', 15000, 'Conversion rate up after model retraining', datetime('now')),
  ('metric-004-uuid-e6f7a8b9', 'model-002-uuid-b2c3d4e5', 'ctr', 0.065, 0.061, 0.004, '7d', 8500, 'Merchant recommendation CTR stable growth', datetime('now')),
  ('metric-005-uuid-f7a8b9c0', 'model-002-uuid-b2c3d4e5', 'precision_at_k', 0.68, 0.66, 0.02, '7d', 8500, 'Precision@10 for merchant recommendations', datetime('now')),
  ('metric-006-uuid-a8b9c0d1', 'model-003-uuid-c3d4e5f6', 'engagement_rate', 0.15, 0.12, 0.03, '7d', 12000, 'Trending services engagement increased', datetime('now'));
