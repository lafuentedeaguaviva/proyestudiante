-- Añadir la columna de educoins a perfiles_usuario
ALTER TABLE public.perfiles_usuario ADD COLUMN IF NOT EXISTS educoins INTEGER DEFAULT 50;

-- Crear una función RPC (Remote Procedure Call) para consumir EduCoins de forma atómica y segura
CREATE OR REPLACE FUNCTION public.consumir_educoin(user_id UUID, amount INTEGER DEFAULT 1)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Bloquear la fila para evitar race conditions
  SELECT educoins INTO current_balance 
  FROM public.perfiles_usuario 
  WHERE id = user_id 
  FOR UPDATE;

  IF current_balance >= amount THEN
    UPDATE public.perfiles_usuario 
    SET educoins = educoins - amount 
    WHERE id = user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
