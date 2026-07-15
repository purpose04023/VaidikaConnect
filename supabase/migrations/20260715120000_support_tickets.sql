-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  issue_description TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies
DROP POLICY IF EXISTS "Allow users to view their own tickets" ON public.support_tickets;
CREATE POLICY "Allow users to view their own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert tickets" ON public.support_tickets;
CREATE POLICY "Allow users to insert tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true); -- Allow creation from anyone/voice AI endpoint

DROP POLICY IF EXISTS "Allow admins full access to tickets" ON public.support_tickets;
CREATE POLICY "Allow admins full access to tickets"
  ON public.support_tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
