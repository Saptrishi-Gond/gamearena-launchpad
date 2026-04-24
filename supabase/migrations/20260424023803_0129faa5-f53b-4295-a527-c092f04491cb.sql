
-- =========================
-- 1. PROFILES: extra fields
-- =========================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS rank text DEFAULT 'Rookie',
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;

-- =========================
-- 2. TOURNAMENTS: extra fields
-- =========================
DO $$ BEGIN
  CREATE TYPE public.tournament_mode AS ENUM ('solo','duo','squad');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.tournaments
  ADD COLUMN IF NOT EXISTS mode public.tournament_mode NOT NULL DEFAULT 'squad',
  ADD COLUMN IF NOT EXISTS region text DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS end_at timestamptz,
  ADD COLUMN IF NOT EXISTS winner_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS prize_split jsonb NOT NULL DEFAULT '[100]'::jsonb;

-- =========================
-- 3. GAME_PROFILES
-- =========================
CREATE TABLE IF NOT EXISTS public.game_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  game public.game_type NOT NULL,
  game_uid text NOT NULL,
  nickname text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, game)
);
ALTER TABLE public.game_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gp read own or admin" ON public.game_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "gp insert own" ON public.game_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gp update own" ON public.game_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gp delete own" ON public.game_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================
-- 4. TOURNAMENT_WINNERS
-- =========================
CREATE TABLE IF NOT EXISTS public.tournament_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rank integer NOT NULL CHECK (rank >= 1),
  prize_amount integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tournament_id, rank),
  UNIQUE (tournament_id, user_id)
);
ALTER TABLE public.tournament_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "winners read all" ON public.tournament_winners
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "winners admin write" ON public.tournament_winners
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- 5. REWARDS
-- =========================
CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,            -- 'tournament_win', 'daily_bonus', 'referral', etc.
  amount integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  claimed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rewards read own or admin" ON public.rewards
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "rewards admin insert" ON public.rewards
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "rewards update own" ON public.rewards
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- =========================
-- 6. SUPPORT TICKETS
-- =========================
DO $$ BEGIN
  CREATE TYPE public.ticket_status AS ENUM ('open','pending','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets read own or admin" ON public.support_tickets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tickets insert own" ON public.support_tickets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tickets update admin or own" ON public.support_tickets
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  message text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "replies read participants" ON public.ticket_replies
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
  );
CREATE POLICY "replies insert participants" ON public.ticket_replies
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
    )
  );

-- =========================
-- 7. MARK WINNERS function
-- =========================
CREATE OR REPLACE FUNCTION public.mark_tournament_winners(
  _tournament_id uuid,
  _winners jsonb  -- [{ "user_id": "...", "rank": 1, "prize_amount": 500 }, ...]
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _w jsonb;
  _uid uuid;
  _rank int;
  _amount int;
  _count int := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin only';
  END IF;

  -- clear any prior winners (idempotent re-mark)
  DELETE FROM public.tournament_winners WHERE tournament_id = _tournament_id;

  FOR _w IN SELECT * FROM jsonb_array_elements(_winners)
  LOOP
    _uid := (_w->>'user_id')::uuid;
    _rank := (_w->>'rank')::int;
    _amount := COALESCE((_w->>'prize_amount')::int, 0);

    INSERT INTO public.tournament_winners (tournament_id, user_id, rank, prize_amount)
    VALUES (_tournament_id, _uid, _rank, _amount);

    IF _amount > 0 THEN
      UPDATE public.profiles SET wallet_coins = wallet_coins + _amount, xp = xp + (_amount / 10)
      WHERE id = _uid;
      INSERT INTO public.wallet_logs (user_id, delta, reason)
      VALUES (_uid, _amount, 'tournament_prize:' || _tournament_id::text);
    END IF;

    INSERT INTO public.rewards (user_id, type, amount, title, claimed)
    VALUES (_uid, 'tournament_win', _amount, 'Rank #' || _rank || ' prize', true);

    INSERT INTO public.notifications (user_id, title, body)
    VALUES (_uid, '🏆 You won!', 'You placed #' || _rank || ' and earned ' || _amount || ' coins.');

    _count := _count + 1;
  END LOOP;

  UPDATE public.tournaments SET status = 'completed' WHERE id = _tournament_id;
  RETURN _count;
END;
$$;
