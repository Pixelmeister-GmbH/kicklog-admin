-- Admin-Bibliothek an TPD-Bibliothek v2 angleichen (Neo, 03.08.2026). Idempotent.
-- 1) Altersklassen auf das offizielle DFB-Schema (wie ALTERSKLASSEN in der Trainer-App)
-- 2) View + Übersicht zeigen nur die kompletten Einheiten, nicht die 4 technischen Phasen-Blöcke

-- 1) Altersklassen-Stammdaten
DELETE FROM training_age_groups WHERE name ~ '^U[0-9]+$';
INSERT INTO training_age_groups (name, sort_order)
SELECT v.name, v.so FROM (VALUES
  ('Bambini',1), ('F-Jugend',2), ('E-Jugend',3), ('D-Jugend',4),
  ('C-Jugend',5), ('B-Jugend',6), ('A-Jugend',7), ('Senior',8)
) AS v(name, so)
WHERE NOT EXISTS (SELECT 1 FROM training_age_groups a WHERE a.name = v.name);
UPDATE training_age_groups SET sort_order = v.so FROM (VALUES
  ('Bambini',1), ('F-Jugend',2), ('E-Jugend',3), ('D-Jugend',4),
  ('C-Jugend',5), ('B-Jugend',6), ('A-Jugend',7), ('Senior',8)
) AS v(name, so) WHERE training_age_groups.name = v.name;

-- 2) View: komplette Einheiten + Anzahl der Phasen-Blöcke je Plan
DROP VIEW IF EXISTS training_plans_with_stats;
CREATE VIEW training_plans_with_stats AS
SELECT tp.id, tp.title, tp.age_group, tp.topic_id, tp.pdf_path, tp.description,
       tp.author_name, tp.is_active, tp.created_at, tp.updated_at, tp.language,
       tt.name AS topic_name, tt.sort_order AS topic_sort,
       COALESCE((SELECT count(*) FROM training_session_plans tsp WHERE tsp.plan_id = tp.id), 0::bigint) AS usage_count,
       COALESCE((SELECT count(*) FROM training_plans b WHERE b.parent_plan_id = tp.id), 0::bigint) AS block_count
FROM training_plans tp
LEFT JOIN training_topics tt ON tt.id = tp.topic_id
WHERE COALESCE(tp.block, 'komplett') = 'komplett';

-- 3) Übersicht: nur komplette Einheiten zählen
CREATE OR REPLACE FUNCTION get_library_overview()
RETURNS TABLE(age_group text, topic_name text, topic_id uuid, plan_count bigint)
LANGUAGE sql STABLE AS $$
  SELECT tp.age_group, tt.name AS topic_name, tp.topic_id, COUNT(*) AS plan_count
  FROM training_plans tp
  JOIN training_topics tt ON tt.id = tp.topic_id
  WHERE tp.is_active = true AND tt.is_active = true
    AND COALESCE(tp.block, 'komplett') = 'komplett'
  GROUP BY tp.age_group, tp.topic_id, tt.name, tt.sort_order
  ORDER BY tp.age_group, tt.sort_order;
$$;

SELECT (SELECT count(*) FROM training_plans_with_stats) AS einheiten,
       (SELECT count(*) FROM training_age_groups) AS altersklassen,
       (SELECT sum(plan_count) FROM get_library_overview()) AS in_uebersicht;

-- Rollback: Altersklassen zurück auf U-Nummern + View/Function auf die Fassungen ohne block-Filter.
