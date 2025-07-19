-- Create master trainer invitations table
CREATE TABLE public.master_trainer_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.master_trainer_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for master trainer invitations
CREATE POLICY "Superadmins can manage invitations"
ON public.master_trainer_invitations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_superadmin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_superadmin = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_master_trainer_invitations_updated_at
BEFORE UPDATE ON public.master_trainer_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint to prevent duplicate invitations
CREATE UNIQUE INDEX idx_master_trainer_invitations_email_pending 
ON public.master_trainer_invitations (email) 
WHERE status = 'pending';