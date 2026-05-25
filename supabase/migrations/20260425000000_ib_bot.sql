-- ============================================================
-- IB Mock Interview Bot: questions, sessions, turns
-- Voice-driven 30-min mock-interview with dynamic progression
-- ============================================================

-- ib_questions: the question bank
CREATE TABLE public.ib_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text,
  question_type text NOT NULL CHECK (question_type IN ('wiedergabe', 'anwendung', 'verstaendnis')),
  archetype text NOT NULL,
  topic text NOT NULL,
  prompt text NOT NULL,
  optimal_answer text NOT NULL,
  key_points text[],
  difficulty_level smallint NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ib_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active ib_questions" ON public.ib_questions
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage ib_questions" ON public.ib_questions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_ib_questions_lookup ON public.ib_questions (topic, archetype, question_type, difficulty_level) WHERE active;
CREATE INDEX idx_ib_questions_archetype ON public.ib_questions (archetype) WHERE active;

-- ib_sessions: one row per interview attempt
CREATE TABLE public.ib_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_rating smallint NOT NULL CHECK (user_rating BETWEEN 1 AND 25),
  starting_difficulty smallint NOT NULL CHECK (starting_difficulty BETWEEN 1 AND 5),
  current_difficulty smallint NOT NULL CHECK (current_difficulty BETWEEN 1 AND 5),
  max_difficulty smallint NOT NULL CHECK (max_difficulty BETWEEN 1 AND 5),
  topics text[] NOT NULL,
  company text,
  archetype_queue text[] NOT NULL DEFAULT '{}',
  current_archetype text,
  current_stage text CHECK (current_stage IN ('wiedergabe', 'anwendung', 'verstaendnis')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  end_reason text,
  final_content_score smallint CHECK (final_content_score BETWEEN 1 AND 5),
  final_structure_score smallint CHECK (final_structure_score BETWEEN 1 AND 5),
  final_delivery_score smallint CHECK (final_delivery_score BETWEEN 1 AND 5),
  passed_topics text[],
  failed_topics text[],
  final_feedback jsonb
);

ALTER TABLE public.ib_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ib_sessions" ON public.ib_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read ib_sessions" ON public.ib_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update ib_sessions" ON public.ib_sessions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE INDEX idx_ib_sessions_user ON public.ib_sessions (user_email, started_at DESC);
CREATE INDEX idx_ib_sessions_active ON public.ib_sessions (id) WHERE ended_at IS NULL;

-- ib_turns: one row per question-answer exchange
CREATE TABLE public.ib_turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.ib_sessions(id) ON DELETE CASCADE,
  turn_index integer NOT NULL,
  question_id uuid REFERENCES public.ib_questions(id),
  archetype text,
  archetype_stage text,
  difficulty_level smallint,
  user_input_mode text CHECK (user_input_mode IN ('text', 'audio')),
  user_transcript text,
  bot_response text,
  bot_audio_storage_path text,
  judge_verdict text CHECK (judge_verdict IN ('correct', 'unvollstaendig', 'falsch', 'n/a')),
  judge_rationale text,
  judge_missing_points text[],
  moved_to_next_archetype boolean NOT NULL DEFAULT false,
  user_response_time_ms integer,
  bot_generation_time_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ib_turns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ib_turns" ON public.ib_turns
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read ib_turns" ON public.ib_turns
  FOR SELECT USING (true);

CREATE INDEX idx_ib_turns_session ON public.ib_turns (session_id, turn_index);

-- Storage bucket for TTS audio (signed URLs, 1h TTL)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ib-bot-audio', 'ib-bot-audio', false, 5242880, ARRAY['audio/mpeg', 'audio/mp3'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read ib-bot-audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'ib-bot-audio');

CREATE POLICY "Service role can write ib-bot-audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ib-bot-audio');
