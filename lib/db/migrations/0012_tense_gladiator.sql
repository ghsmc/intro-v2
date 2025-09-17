CREATE TABLE IF NOT EXISTS "YaleAlumni" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linkedinId" varchar(255) NOT NULL,
	"linkedinNumId" varchar(50),
	"name" varchar(255) NOT NULL,
	"position" text,
	"about" text,
	"location" varchar(255),
	"city" varchar(255),
	"countryCode" varchar(10),
	"avatar" text,
	"bannerImage" text,
	"url" text NOT NULL,
	"inputUrl" text,
	"connections" integer,
	"followers" integer,
	"recommendationsCount" integer,
	"memorializedAccount" boolean DEFAULT false,
	"defaultAvatar" boolean DEFAULT false,
	"currentCompanyName" varchar(255),
	"currentCompanyId" varchar(100),
	"currentCompany" jsonb,
	"education" jsonb,
	"experience" jsonb,
	"certifications" jsonb,
	"languages" jsonb,
	"volunteerExperience" jsonb,
	"honorsAndAwards" jsonb,
	"organizations" jsonb,
	"patents" jsonb,
	"publications" jsonb,
	"projects" jsonb,
	"courses" jsonb,
	"bioLinks" jsonb,
	"recommendations" jsonb,
	"activity" jsonb,
	"posts" jsonb,
	"peopleAlsoViewed" jsonb,
	"similarProfiles" jsonb,
	"searchableText" text,
	"skills" jsonb,
	"industries" jsonb,
	"companies" jsonb,
	"schools" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "YaleAlumni_linkedinId_unique" UNIQUE("linkedinId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "YaleEducation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alumniId" uuid NOT NULL,
	"schoolName" varchar(255) NOT NULL,
	"degree" varchar(255),
	"fieldOfStudy" varchar(255),
	"startDate" varchar(50),
	"endDate" varchar(50),
	"description" text,
	"rawData" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "YaleExperience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alumniId" uuid NOT NULL,
	"companyName" varchar(255) NOT NULL,
	"position" varchar(255),
	"location" varchar(255),
	"startDate" varchar(50),
	"endDate" varchar(50),
	"duration" varchar(100),
	"description" text,
	"isCurrent" boolean DEFAULT false,
	"rawData" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "YaleSkills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alumniId" uuid NOT NULL,
	"skill" varchar(255) NOT NULL,
	"category" varchar(100),
	"source" varchar(100)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YaleEducation" ADD CONSTRAINT "YaleEducation_alumniId_YaleAlumni_id_fk" FOREIGN KEY ("alumniId") REFERENCES "public"."YaleAlumni"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YaleExperience" ADD CONSTRAINT "YaleExperience_alumniId_YaleAlumni_id_fk" FOREIGN KEY ("alumniId") REFERENCES "public"."YaleAlumni"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YaleSkills" ADD CONSTRAINT "YaleSkills_alumniId_YaleAlumni_id_fk" FOREIGN KEY ("alumniId") REFERENCES "public"."YaleAlumni"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_alumni_linkedin_id_idx" ON "YaleAlumni" USING btree ("linkedinId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_alumni_name_idx" ON "YaleAlumni" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_alumni_location_idx" ON "YaleAlumni" USING btree ("location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_alumni_current_company_idx" ON "YaleAlumni" USING btree ("currentCompanyName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_alumni_searchable_text_idx" ON "YaleAlumni" USING btree ("searchableText");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_education_alumni_id_idx" ON "YaleEducation" USING btree ("alumniId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_education_school_name_idx" ON "YaleEducation" USING btree ("schoolName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_education_degree_idx" ON "YaleEducation" USING btree ("degree");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_education_field_of_study_idx" ON "YaleEducation" USING btree ("fieldOfStudy");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_experience_alumni_id_idx" ON "YaleExperience" USING btree ("alumniId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_experience_company_name_idx" ON "YaleExperience" USING btree ("companyName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_experience_position_idx" ON "YaleExperience" USING btree ("position");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_experience_is_current_idx" ON "YaleExperience" USING btree ("isCurrent");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_skills_alumni_id_idx" ON "YaleSkills" USING btree ("alumniId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_skills_skill_idx" ON "YaleSkills" USING btree ("skill");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "yale_skills_category_idx" ON "YaleSkills" USING btree ("category");