import 'server-only';

import {
  and,
  eq,
  ilike,
  inArray,
  sql,
  desc,
  asc,
  gte,
  lte,
  or,
  type SQL,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  job,
  jobApplication,
  jobSearchPreference,
  jobInteraction,
  company,
  type Job,
  type JobApplication,
  type JobSearchPreference,
  type JobInteraction,
} from '../schema';

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

// Types for job search
export interface JobSearchParams {
  query?: string;
  companyIds?: string[];
  locations?: string[];
  remoteTypes?: string[];
  levels?: string[];
  types?: string[];
  departments?: string[];
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'postedAt' | 'salary' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface JobCreateParams {
  companyId: string;
  title: string;
  description: string;
  type: string;
  location?: string;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  remoteType?: string;
  level?: string;
  department?: string;
  team?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  equity?: string;
  benefits?: string[];
  requirements?: string[];
  responsibilities?: string[];
  preferredQualifications?: string[];
  skills?: string[];
  categories?: string[];
  tags?: string[];
  applicationUrl?: string;
  applicationEmail?: string;
  applicationDeadline?: Date;
  source?: string;
  sourceUrl?: string;
  externalId?: string;
}

// Search jobs with multiple filters
export async function searchJobs(params: JobSearchParams): Promise<Job[]> {
  const conditions: SQL[] = [eq(job.status, params.status || 'active')];

  // Text search
  if (params.query) {
    conditions.push(
      or(
        ilike(job.title, `%${params.query}%`),
        ilike(job.description, `%${params.query}%`),
        ilike(job.keywords, `%${params.query}%`),
      )!,
    );
  }

  // Company filter
  if (params.companyIds?.length) {
    conditions.push(inArray(job.companyId, params.companyIds));
  }

  // Location filters
  if (params.locations?.length) {
    const locationConditions = params.locations.map((loc) =>
      or(
        ilike(job.location, `%${loc}%`),
        ilike(job.locationCity, `%${loc}%`),
        ilike(job.locationState, `%${loc}%`),
      ),
    );
    conditions.push(or(...locationConditions)!);
  }

  // Remote type filter
  if (params.remoteTypes?.length) {
    conditions.push(inArray(job.remoteType, params.remoteTypes));
  }

  // Level filter
  if (params.levels?.length) {
    conditions.push(inArray(job.level, params.levels));
  }

  // Job type filter
  if (params.types?.length) {
    conditions.push(inArray(job.type, params.types));
  }

  // Department filter
  if (params.departments?.length) {
    conditions.push(inArray(job.department, params.departments));
  }

  // Salary range filter
  if (params.salaryMin) {
    conditions.push(gte(job.salaryMax, params.salaryMin));
  }
  if (params.salaryMax) {
    conditions.push(lte(job.salaryMin, params.salaryMax));
  }

  // Skills filter (using JSON contains)
  if (params.skills?.length) {
    const skillConditions = params.skills.map((skill) =>
      sql`${job.skills}::jsonb @> ${JSON.stringify([skill])}::jsonb`,
    );
    conditions.push(or(...skillConditions)!);
  }

  // Build query with sorting and pagination
  const sortOrder = params.sortOrder === 'asc' ? asc : desc;
  const orderByColumn = params.sortBy === 'salary' ? job.salaryMax : job.postedAt;

  const baseQuery = db
    .select()
    .from(job)
    .where(and(...conditions))
    .orderBy(sortOrder(orderByColumn));

  // Apply pagination if specified
  const finalQuery = params.limit
    ? params.offset
      ? baseQuery.limit(params.limit).offset(params.offset)
      : baseQuery.limit(params.limit)
    : params.offset
    ? baseQuery.offset(params.offset)
    : baseQuery;

  return await finalQuery;
}

// Get jobs by company
export async function getJobsByCompany(
  companyId: string,
  status = 'active',
): Promise<Job[]> {
  return await db
    .select()
    .from(job)
    .where(and(eq(job.companyId, companyId), eq(job.status, status)))
    .orderBy(desc(job.postedAt));
}

// Get job with company details
export async function getJobWithCompany(jobId: string) {
  const result = await db
    .select({
      job: job,
      company: company,
    })
    .from(job)
    .innerJoin(company, eq(job.companyId, company.id))
    .where(eq(job.id, jobId))
    .limit(1);

  return result[0];
}

// Create a new job
export async function createJob(params: JobCreateParams): Promise<Job> {
  const [newJob] = await db
    .insert(job)
    .values({
      ...params,
      keywords: generateKeywords(params),
      aiSummary: await generateAISummary(params),
    })
    .returning();

  return newJob;
}

// Update job
export async function updateJob(
  jobId: string,
  updates: Partial<JobCreateParams>,
): Promise<Job> {
  const [updatedJob] = await db
    .update(job)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(job.id, jobId))
    .returning();

  return updatedJob;
}

// Get user's job applications
export async function getUserApplications(
  userId: string,
): Promise<JobApplication[]> {
  return await db
    .select()
    .from(jobApplication)
    .where(eq(jobApplication.userId, userId))
    .orderBy(desc(jobApplication.updatedAt));
}

// Create job application
export async function createJobApplication(
  userId: string,
  jobId: string,
  data: {
    coverLetter?: string;
    resumeVersion?: any;
    customAnswers?: any;
  },
): Promise<JobApplication> {
  // Check if application already exists
  const existing = await db
    .select()
    .from(jobApplication)
    .where(
      and(
        eq(jobApplication.userId, userId),
        eq(jobApplication.jobId, jobId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error('Application already exists for this job');
  }

  const [newApplication] = await db
    .insert(jobApplication)
    .values({
      userId,
      jobId,
      ...data,
      status: 'submitted',
      appliedAt: new Date(),
    })
    .returning();

  // Track interaction
  await trackJobInteraction(userId, jobId, 'applied');

  return newApplication;
}

// Get or create user preferences
export async function getUserPreferences(
  userId: string,
): Promise<JobSearchPreference | null> {
  const [preference] = await db
    .select()
    .from(jobSearchPreference)
    .where(eq(jobSearchPreference.userId, userId))
    .limit(1);

  return preference || null;
}

// Update user preferences
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<JobSearchPreference>,
): Promise<JobSearchPreference> {
  const existing = await getUserPreferences(userId);

  if (existing) {
    const [updated] = await db
      .update(jobSearchPreference)
      .set({
        ...preferences,
        updatedAt: new Date(),
      })
      .where(eq(jobSearchPreference.userId, userId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(jobSearchPreference)
    .values({
      userId,
      ...preferences,
    })
    .returning();
  return created;
}

// Track job interaction
export async function trackJobInteraction(
  userId: string,
  jobId: string,
  action: string,
  context?: any,
): Promise<void> {
  await db.insert(jobInteraction).values({
    userId,
    jobId,
    action,
    context,
  });
}

// Get recommended jobs for user
export async function getRecommendedJobs(
  userId: string,
  limit = 10,
): Promise<Job[]> {
  // Get user preferences
  const preferences = await getUserPreferences(userId);
  if (!preferences) {
    // Return featured jobs if no preferences
    return await db
      .select()
      .from(job)
      .where(and(eq(job.status, 'active'), eq(job.featured, true)))
      .orderBy(desc(job.postedAt))
      .limit(limit);
  }

  // Build conditions based on preferences
  const conditions: SQL[] = [eq(job.status, 'active')];

  // Filter by preferred locations
  if (preferences.desiredLocations && Array.isArray(preferences.desiredLocations) && preferences.desiredLocations.length > 0) {
    const locationConditions = (
      preferences.desiredLocations as string[]
    ).map((loc) => ilike(job.location, `%${loc}%`));
    conditions.push(or(...locationConditions)!);
  }

  // Filter by remote preference
  if (preferences.remotePreference && preferences.remotePreference !== 'any') {
    if (preferences.remotePreference === 'remote-only') {
      conditions.push(eq(job.remoteType, 'remote'));
    } else if (preferences.remotePreference === 'hybrid-ok') {
      conditions.push(inArray(job.remoteType, ['remote', 'hybrid']));
    }
  }

  // Filter by salary expectations
  if (preferences.minSalary) {
    conditions.push(gte(job.salaryMax, preferences.minSalary));
  }

  // Filter by job types
  if (preferences.jobTypes && Array.isArray(preferences.jobTypes) && preferences.jobTypes.length > 0) {
    conditions.push(inArray(job.type, preferences.jobTypes as string[]));
  }

  // Filter by experience level
  if (preferences.experienceLevel) {
    conditions.push(eq(job.level, preferences.experienceLevel));
  }

  return await db
    .select()
    .from(job)
    .where(and(...conditions))
    .orderBy(desc(job.postedAt))
    .limit(limit);
}

// Helper function to generate keywords for search
function generateKeywords(params: JobCreateParams): string {
  const keywords = [
    params.title,
    params.department,
    params.team,
    ...(params.skills || []),
    ...(params.categories || []),
    ...(params.tags || []),
  ]
    .filter(Boolean)
    .join(' ');

  return keywords.toLowerCase();
}

// Helper function to generate AI summary (placeholder)
async function generateAISummary(params: JobCreateParams): Promise<string> {
  // This would integrate with your AI model to generate summaries
  // For now, return a simple summary
  return `${params.title} position at company requiring ${
    params.skills?.join(', ') || 'various skills'
  }. ${params.type} role ${
    params.location ? `in ${params.location}` : ''
  }. Salary range: ${
    params.salaryMin && params.salaryMax
      ? `$${params.salaryMin}-$${params.salaryMax}`
      : 'Competitive'
  }.`;
}

// Batch operations for job import
export async function batchCreateJobs(
  jobs: JobCreateParams[],
): Promise<Job[]> {
  const jobsWithMetadata = jobs.map((jobData) => ({
    ...jobData,
    keywords: generateKeywords(jobData),
    status: 'active' as const,
  }));

  return await db.insert(job).values(jobsWithMetadata).returning();
}

// Search jobs with semantic similarity (requires pgvector extension)
export async function searchJobsSemantic(
  queryEmbedding: number[],
  limit = 10,
): Promise<Job[]> {
  // This would use pgvector for semantic search
  // Requires the embedding column to be populated with vector embeddings
  const query = sql`
    SELECT * FROM ${job}
    WHERE status = 'active'
    ORDER BY embedding <-> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${limit}
  `;

  return await db.execute(query);
}