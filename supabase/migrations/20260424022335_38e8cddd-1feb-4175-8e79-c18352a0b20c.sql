
-- Roles enum + table (security definer)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  game_id_freefire TEXT,
  game_id_bgmi TEXT,
  game_id_fc TEXT,
  wallet_coins INTEGER NOT NULL DEFAULT 100,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role);
$$;

CREATE TYPE public.game_type AS ENUM ('freefire', 'bgmi', 'fc');
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'live', 'completed', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('confirmed', 'checked_in', 'cancelled', 'won', 'lost');

CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game game_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  match_at TIMESTAMPTZ NOT NULL,
  total_slots INTEGER NOT NULL,
  slots_left INTEGER NOT NULL,
  entry_fee INTEGER NOT NULL DEFAULT 0,
  prize_pool INTEGER NOT NULL DEFAULT 0,
  room_id TEXT,
  room_password TEXT,
  status tournament_status NOT NULL DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  in_game_id TEXT,
  status booking_status NOT NULL DEFAULT 'confirmed',
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tournament_id, user_id)
);

CREATE TABLE public.wallet_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles select own or admin" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- user_roles: only admins manage; users can read own
CREATE POLICY "roles read own" ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles admin manage" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tournaments: everyone can read, admin write
CREATE POLICY "tournaments read all" ON public.tournaments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "tournaments admin all" ON public.tournaments FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookings
CREATE POLICY "bookings read own or admin" ON public.bookings FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "bookings insert own" ON public.bookings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings update own or admin" ON public.bookings FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "bookings delete admin" ON public.bookings FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Wallet logs
CREATE POLICY "wallet read own or admin" ON public.wallet_logs FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "wallet insert admin" ON public.wallet_logs FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE POLICY "notif read own" ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "notif update own" ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "notif admin insert" ON public.notifications FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic booking: decrement slots safely
CREATE OR REPLACE FUNCTION public.book_tournament(_tournament_id UUID, _in_game_id TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _booking_id UUID;
  _fee INTEGER;
  _slots INTEGER;
  _coins INTEGER;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT entry_fee, slots_left INTO _fee, _slots FROM public.tournaments WHERE id = _tournament_id FOR UPDATE;
  IF _slots IS NULL THEN RAISE EXCEPTION 'Tournament not found'; END IF;
  IF _slots <= 0 THEN RAISE EXCEPTION 'Tournament full'; END IF;

  IF _fee > 0 THEN
    SELECT wallet_coins INTO _coins FROM public.profiles WHERE id = _uid FOR UPDATE;
    IF _coins < _fee THEN RAISE EXCEPTION 'Insufficient coins'; END IF;
    UPDATE public.profiles SET wallet_coins = wallet_coins - _fee WHERE id = _uid;
    INSERT INTO public.wallet_logs (user_id, delta, reason) VALUES (_uid, -_fee, 'tournament_entry');
  END IF;

  UPDATE public.tournaments SET slots_left = slots_left - 1 WHERE id = _tournament_id;
  INSERT INTO public.bookings (tournament_id, user_id, in_game_id) VALUES (_tournament_id, _uid, _in_game_id)
  RETURNING id INTO _booking_id;
  RETURN _booking_id;
END;
$$;
