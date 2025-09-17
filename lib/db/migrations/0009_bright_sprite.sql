ALTER TABLE "User" ADD COLUMN "energyProfile" jsonb;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "peakMoment" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "values" jsonb;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "constraints" jsonb;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "immediateGoal" varchar(64);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "onboardingCompleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "onboardingEngagement" jsonb;