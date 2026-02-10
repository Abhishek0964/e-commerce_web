-- Add email column which was missing but referenced in trigger
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
