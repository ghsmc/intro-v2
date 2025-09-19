-- Fix Company table if needed
DO $$
BEGIN
  -- Add domainType column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Company' AND column_name = 'domainType'
  ) THEN
    ALTER TABLE "Company" ADD COLUMN "domainType" varchar NOT NULL DEFAULT 'SOFTWARE';
  END IF;
END $$;

-- Create or update the index for domainType
DROP INDEX IF EXISTS "company_domain_idx";
CREATE INDEX "company_domain_idx" ON "Company" ("domainType");

-- Create Job table
CREATE TABLE IF NOT EXISTS "Job" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "companyId" uuid NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,

  -- Basic Information
  "title" varchar(256) NOT NULL,
  "department" varchar(128),
  "team" varchar(128),
  "level" varchar(64),
  "type" varchar(64) NOT NULL,

  -- Location & Remote
  "location" varchar(256),
  "locationCity" varchar(128),
  "locationState" varchar(64),
  "locationCountry" varchar(64),
  "remoteType" varchar(32),

  -- Compensation
  "salaryMin" integer,
  "salaryMax" integer,
  "salaryCurrency" varchar(8) DEFAULT 'USD',
  "salaryPeriod" varchar(16) DEFAULT 'year',
  "equity" varchar(64),
  "benefits" jsonb,

  -- Description & Requirements
  "description" text NOT NULL,
  "requirements" jsonb,
  "responsibilities" jsonb,
  "preferredQualifications" jsonb,

  -- Skills & Categories
  "skills" jsonb,
  "categories" jsonb,
  "tags" jsonb,
  "keywords" text,

  -- Application Info
  "applicationUrl" varchar(512),
  "applicationEmail" varchar(256),
  "applicationDeadline" timestamp,

  -- Metadata
  "externalId" varchar(256),
  "source" varchar(64),
  "sourceUrl" varchar(512),

  -- Status
  "status" varchar(32) DEFAULT 'active' NOT NULL,
  "featured" boolean DEFAULT false,
  "verified" boolean DEFAULT false,

  -- Timestamps
  "postedAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "expiresAt" timestamp,

  -- LLM-optimized fields
  "embedding" jsonb,
  "aiSummary" text,
  "aiMatchCriteria" jsonb
);

-- Create indexes for Job table
CREATE INDEX IF NOT EXISTS "job_company_idx" ON "Job" ("companyId");
CREATE INDEX IF NOT EXISTS "job_status_idx" ON "Job" ("status");
CREATE INDEX IF NOT EXISTS "job_posted_at_idx" ON "Job" ("postedAt");
CREATE INDEX IF NOT EXISTS "job_company_status_idx" ON "Job" ("companyId", "status");

-- Create JobApplication table
CREATE TABLE IF NOT EXISTS "JobApplication" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "jobId" uuid NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,

  "status" varchar(32) DEFAULT 'draft' NOT NULL,
  "stage" varchar(64),

  "coverLetter" text,
  "resumeVersion" jsonb,
  "customAnswers" jsonb,

  "notes" text,

  "appliedAt" timestamp,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for JobApplication table
CREATE INDEX IF NOT EXISTS "application_user_idx" ON "JobApplication" ("userId");
CREATE INDEX IF NOT EXISTS "application_job_idx" ON "JobApplication" ("jobId");
CREATE UNIQUE INDEX IF NOT EXISTS "application_user_job_idx" ON "JobApplication" ("userId", "jobId");

-- Create JobSearchPreference table
CREATE TABLE IF NOT EXISTS "JobSearchPreference" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,

  -- Preferences
  "desiredRoles" jsonb,
  "desiredCompanies" jsonb,
  "desiredLocations" jsonb,
  "remotePreference" varchar(32),

  -- Compensation expectations
  "minSalary" integer,
  "maxSalary" integer,
  "salaryCurrency" varchar(8) DEFAULT 'USD',

  -- Work preferences
  "companySize" jsonb,
  "industries" jsonb,
  "jobTypes" jsonb,
  "experienceLevel" varchar(32),

  -- Skills & interests
  "skills" jsonb,
  "interests" jsonb,

  -- Search settings
  "alertsEnabled" boolean DEFAULT true,
  "alertFrequency" varchar(16) DEFAULT 'daily',

  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create JobInteraction table
CREATE TABLE IF NOT EXISTS "JobInteraction" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "jobId" uuid NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,

  "action" varchar(32) NOT NULL,
  "context" jsonb,

  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for JobInteraction table
CREATE INDEX IF NOT EXISTS "interaction_user_idx" ON "JobInteraction" ("userId");
CREATE INDEX IF NOT EXISTS "interaction_job_idx" ON "JobInteraction" ("jobId");
CREATE INDEX IF NOT EXISTS "interaction_action_idx" ON "JobInteraction" ("action");