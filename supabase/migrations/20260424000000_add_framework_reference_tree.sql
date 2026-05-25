-- ============================================================
-- Add reference_tree column to framework_cases
-- Stores the sample solution as a hierarchical FrameworkNode[] (JSONB)
-- so the result screen can render the same graphical tree format
-- used during user input. Nullable — clients fall back to the
-- existing plain-text reference_solution when null.
-- ============================================================

ALTER TABLE public.framework_cases
  ADD COLUMN IF NOT EXISTS reference_tree jsonb;
