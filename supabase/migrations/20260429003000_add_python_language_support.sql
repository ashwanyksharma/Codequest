/*
  # Add Python Language Support

  Extends submissions.language to allow javascript, cpp, and python.
*/

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.submissions'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%language%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.submissions DROP CONSTRAINT %I', constraint_name);
  END IF;

  ALTER TABLE public.submissions
    ADD CONSTRAINT submissions_language_check
    CHECK (language IN ('javascript', 'cpp', 'python'));
END $$;
