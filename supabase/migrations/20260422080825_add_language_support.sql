
/*
  # Add C++ Language Support

  1. Changes
    - Add `language` column to submissions table to track which language was used
    - Default to 'javascript' for backward compatibility
    - Allows future expansion to other languages (Python, Java, etc.)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'language'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'submissions'
  ) THEN
    ALTER TABLE submissions ADD COLUMN language text DEFAULT 'javascript' CHECK (language IN ('javascript', 'cpp'));
  END IF;
END $$;
