CREATE TABLE IF NOT EXISTS "Company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"ticker" varchar(16),
	"domain" varchar(128),
	"description" text,
	"category" varchar(64) NOT NULL,
	"subcategory" varchar(64),
	"industry" varchar(64),
	"valuation" varchar(32),
	"fundingStage" varchar(32),
	"employees" varchar(32),
	"location" varchar(128),
	"websiteUrl" varchar(256),
	"jobsUrl" varchar(256),
	"logoUrl" varchar(256),
	"rank" integer,
	"previousRank" integer,
	"trending" varchar,
	"growth" varchar(16),
	"domainType" varchar NOT NULL DEFAULT 'SOFTWARE',
	"featured" boolean DEFAULT false,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for better performance
-- Skip indexes for columns that might not exist
DO $$
BEGIN
  -- Check and create domainType index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Company' AND column_name = 'domainType'
  ) THEN
    CREATE INDEX IF NOT EXISTS "company_domain_idx" ON "Company" ("domainType");
  END IF;

  -- Check and create rank index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Company' AND column_name = 'rank'
  ) THEN
    CREATE INDEX IF NOT EXISTS "company_rank_idx" ON "Company" ("rank");
  END IF;

  -- Check and create category index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Company' AND column_name = 'category'
  ) THEN
    CREATE INDEX IF NOT EXISTS "company_category_idx" ON "Company" ("category");
  END IF;

  -- Check and create name index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Company' AND column_name = 'name'
  ) THEN
    CREATE INDEX IF NOT EXISTS "company_name_idx" ON "Company" ("name");
  END IF;
END $$;