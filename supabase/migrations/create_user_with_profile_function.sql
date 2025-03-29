CREATE OR REPLACE FUNCTION create_user_with_profile(
  p_email TEXT,
  p_password TEXT,
  p_role TEXT,
  p_profile_data JSONB
) RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Start transaction
  BEGIN
    -- Create user
    INSERT INTO users (email, password, role)
    VALUES (p_email, p_password, p_role)
    RETURNING id INTO v_user_id;

    -- Create profile based on role
    CASE p_role
      WHEN 'company' THEN
        INSERT INTO companies (
          user_id,
          name,
          industry,
          company_size,
          website,
          location,
          description
        ) VALUES (
          v_user_id,
          p_profile_data->>'companyName',
          p_profile_data->>'industry',
          p_profile_data->>'companySize',
          p_profile_data->>'website',
          p_profile_data->>'location',
          p_profile_data->>'description'
        );

      WHEN 'interviewer' THEN
        INSERT INTO interviewers (
          user_id,
          full_name,
          expertise,
          years_of_experience,
          current_company,
          linkedin_profile
        ) VALUES (
          v_user_id,
          p_profile_data->>'fullName',
          (p_profile_data->>'expertise')::TEXT[],
          (p_profile_data->>'yearsOfExperience')::INTEGER,
          p_profile_data->>'currentCompany',
          p_profile_data->>'linkedinProfile'
        );

      WHEN 'job_seeker' THEN
        INSERT INTO job_seekers (
          user_id,
          full_name,
          skills,
          experience,
          education,
          resume_url,
          linkedin_profile,
          portfolio_url,
          preferred_roles
        ) VALUES (
          v_user_id,
          p_profile_data->>'fullName',
          (p_profile_data->>'skills')::TEXT[],
          p_profile_data->>'experience',
          p_profile_data->>'education',
          p_profile_data->>'resumeUrl',
          p_profile_data->>'linkedinProfile',
          p_profile_data->>'portfolioUrl',
          (p_profile_data->>'preferredRoles')::TEXT[]
        );

      ELSE
        RAISE EXCEPTION 'Invalid role: %', p_role;
    END CASE;

    -- Return the created user
    RETURN QUERY
    SELECT u.id, u.email, u.role
    FROM users u
    WHERE u.id = v_user_id;

  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback will happen automatically
      RAISE EXCEPTION 'Error creating user and profile: %', SQLERRM;
  END;
END;
$$; 