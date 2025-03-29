-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.job_seekers;
DROP TABLE IF EXISTS public.interviewers;
DROP TABLE IF EXISTS public.companies;
DROP TABLE IF EXISTS public.users;

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    company_size TEXT NOT NULL,
    website TEXT,
    location TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create interviewers table
CREATE TABLE IF NOT EXISTS public.interviewers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    expertise TEXT[] NOT NULL,
    years_of_experience INTEGER NOT NULL,
    current_company TEXT,
    linkedin_profile TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create job_seekers table
CREATE TABLE IF NOT EXISTS public.job_seekers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    experience TEXT,
    education TEXT,
    resume_url TEXT,
    linkedin_profile TEXT,
    portfolio_url TEXT,
    preferred_roles TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviewers_updated_at
    BEFORE UPDATE ON interviewers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seekers_updated_at
    BEFORE UPDATE ON job_seekers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own company profile"
ON public.companies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile"
ON public.companies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own interviewer profile"
ON public.interviewers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviewer profile"
ON public.interviewers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own job seeker profile"
ON public.job_seekers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own job seeker profile"
ON public.job_seekers FOR UPDATE
USING (auth.uid() = user_id);

-- Allow insert for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow insert for authenticated users" ON public.interviewers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow insert for authenticated users" ON public.job_seekers FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 