-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture TEXT,
  date_of_birth DATE,
  phone VARCHAR(20),
  address TEXT,
  recovery_start_date DATE,
  recovery_goal TEXT,
  emergency_contact VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('daily', 'weekly', 'monthly')),
  target_date TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create health_history table
CREATE TABLE IF NOT EXISTS health_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date TIMESTAMP NOT NULL,
  substance_type VARCHAR(100) NOT NULL,
  use_frequency VARCHAR(100),
  duration VARCHAR(100),
  symptoms TEXT[],
  medical_treatment TEXT,
  doctor_name VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  sober_days INTEGER NOT NULL,
  mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  milestones TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create preferences table
CREATE TABLE IF NOT EXISTS preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  weekly_reports BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(100) DEFAULT 'UTC',
  privacy_level VARCHAR(50) NOT NULL DEFAULT 'friends-only' CHECK (privacy_level IN ('public', 'friends-only', 'private')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create support_groups table
CREATE TABLE IF NOT EXISTS support_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  meeting_day VARCHAR(50),
  meeting_time VARCHAR(50),
  location TEXT,
  meeting_link TEXT,
  facilitator VARCHAR(100),
  max_members INTEGER,
  current_members INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create support_group_members table
CREATE TABLE IF NOT EXISTS support_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'facilitator')),
  UNIQUE(group_id, user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  badge TEXT,
  requirements TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create awards table
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  badge TEXT,
  category VARCHAR(100),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  milestone INTEGER
);

-- Create OTP codes table (for two-factor authentication & verification)
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Google OAuth tokens table (for storing OAuth data)
CREATE TABLE IF NOT EXISTS google_auth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  google_id VARCHAR(255) NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP NOT NULL,
  email VARCHAR(255) NOT NULL,
  scope TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_health_history_user_id ON health_history(user_id);
CREATE INDEX IF NOT EXISTS idx_health_history_date ON health_history(record_date);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);
CREATE INDEX IF NOT EXISTS idx_support_group_members_user_id ON support_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_support_group_members_group_id ON support_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_awards_user_id ON awards(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_google_auth_tokens_user_id ON google_auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_google_auth_tokens_google_id ON google_auth_tokens(google_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_auth_tokens ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Goals RLS policies
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create goals" ON goals
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Health History RLS policies
CREATE POLICY "Users can view their own health history" ON health_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create health history records" ON health_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own health history" ON health_history
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own health history" ON health_history
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Progress RLS policies
CREATE POLICY "Users can view their own progress" ON progress
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create progress entries" ON progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own progress" ON progress
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own progress" ON progress
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Preferences RLS policies
CREATE POLICY "Users can view their own preferences" ON preferences
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own preferences" ON preferences
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Support Groups RLS policies (public read, authenticated write)
CREATE POLICY "Anyone can view support groups" ON support_groups
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create support groups" ON support_groups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Support Group Members RLS policies
CREATE POLICY "Users can view support group members" ON support_group_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join support groups" ON support_group_members
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can leave support groups" ON support_group_members
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Awards RLS policies
CREATE POLICY "Users can view their own awards" ON awards
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- OTP Codes RLS policies
CREATE POLICY "Users can view their own OTP codes" ON otp_codes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create OTP codes" ON otp_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own OTP codes" ON otp_codes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Password Reset Tokens RLS policies
CREATE POLICY "Users can view their own password reset tokens" ON password_reset_tokens
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create password reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own password reset tokens" ON password_reset_tokens
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Google Auth Tokens RLS policies
CREATE POLICY "Users can view their own Google auth tokens" ON google_auth_tokens
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create Google auth tokens" ON google_auth_tokens
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own Google auth tokens" ON google_auth_tokens
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own Google auth tokens" ON google_auth_tokens
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Functions for stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE(
  total_goals INTEGER,
  completed_goals INTEGER,
  total_sober_days INTEGER,
  average_mood NUMERIC,
  support_groups_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM goals WHERE goals.user_id = get_user_stats.user_id)::INTEGER,
    (SELECT COUNT(*) FROM goals WHERE goals.user_id = get_user_stats.user_id AND status = 'completed')::INTEGER,
    (SELECT COALESCE(MAX(sober_days), 0) FROM progress WHERE progress.user_id = get_user_stats.user_id)::INTEGER,
    (SELECT COALESCE(AVG(mood_rating), 0) FROM progress WHERE progress.user_id = get_user_stats.user_id),
    (SELECT COUNT(*) FROM support_group_members WHERE support_group_members.user_id = get_user_stats.user_id)::INTEGER;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_total_sober_days(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COALESCE(MAX(sober_days), 0) FROM progress WHERE progress.user_id = get_total_sober_days.user_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_and_award_achievements(user_id UUID)
RETURNS TABLE(id UUID, name VARCHAR, category VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT
    awards.id,
    awards.name,
    awards.category
  FROM awards
  WHERE awards.user_id = check_and_award_achievements.user_id
  ORDER BY awards.awarded_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
