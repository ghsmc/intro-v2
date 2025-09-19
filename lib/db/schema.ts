import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  jsonb,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { AppUsage } from '../usage';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
  name: varchar('name', { length: 128 }),
  major: varchar('major', { length: 128 }),
  classYear: varchar('classYear', { length: 16 }),
  // Onboarding data
  energyProfile: jsonb('energyProfile'),
  peakMoment: text('peakMoment'),
  values: jsonb('values'),
  constraints: jsonb('constraints'),
  immediateGoal: varchar('immediateGoal', { length: 64 }),
  resume: jsonb('resume'),
  resumeData: jsonb('resumeData'),
  userSummary: jsonb('userSummary'),
  onboardingCompleted: boolean('onboardingCompleted').default(false),
  onboardingEngagement: jsonb('onboardingEngagement'),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
  lastContext: jsonb('lastContext').$type<AppUsage | null>(),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable('Message_v2', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  'Vote_v2',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'Stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chatId: uuid('chatId').notNull(),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  }),
);

export type Stream = InferSelectModel<typeof stream>;

export const company = pgTable('Company', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 128 }).notNull(),
  ticker: varchar('ticker', { length: 16 }),
  domain: varchar('domain', { length: 128 }),
  description: text('description'),
  category: varchar('category', { length: 64 }).notNull(),
  subcategory: varchar('subcategory', { length: 64 }),
  industry: varchar('industry', { length: 64 }),
  valuation: varchar('valuation', { length: 32 }),
  fundingStage: varchar('fundingStage', { length: 32 }),
  employees: varchar('employees', { length: 32 }),
  location: varchar('location', { length: 128 }),
  websiteUrl: varchar('websiteUrl', { length: 256 }),
  jobsUrl: varchar('jobsUrl', { length: 256 }),
  logoUrl: varchar('logoUrl', { length: 256 }),
  rank: integer('rank'),
  previousRank: integer('previousRank'),
  trending: varchar('trending', { enum: ['up', 'down', 'stable'] }),
  growth: varchar('growth', { length: 16 }),
  domainType: varchar('domainType', { enum: ['ENGINEERS', 'SOFTWARE', 'FINANCE'] }).notNull(),
  featured: boolean('featured').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Company = InferSelectModel<typeof company>;

// Job-related tables for comprehensive job tracking
export const job = pgTable('Job', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  companyId: uuid('companyId')
    .notNull()
    .references(() => company.id, { onDelete: 'cascade' }),

  // Basic Information
  title: varchar('title', { length: 256 }).notNull(),
  department: varchar('department', { length: 128 }),
  team: varchar('team', { length: 128 }),
  level: varchar('level', { length: 64 }), // entry, mid, senior, lead, principal, staff
  type: varchar('type', { length: 64 }).notNull(), // full-time, part-time, contract, internship

  // Location & Remote
  location: varchar('location', { length: 256 }),
  locationCity: varchar('locationCity', { length: 128 }),
  locationState: varchar('locationState', { length: 64 }),
  locationCountry: varchar('locationCountry', { length: 64 }),
  remoteType: varchar('remoteType', { length: 32 }), // remote, hybrid, onsite

  // Compensation
  salaryMin: integer('salaryMin'),
  salaryMax: integer('salaryMax'),
  salaryCurrency: varchar('salaryCurrency', { length: 8 }).default('USD'),
  salaryPeriod: varchar('salaryPeriod', { length: 16 }).default('year'), // year, month, hour
  equity: varchar('equity', { length: 64 }),
  benefits: jsonb('benefits'), // Array of benefits

  // Description & Requirements
  description: text('description').notNull(),
  requirements: jsonb('requirements'), // Array of requirements
  responsibilities: jsonb('responsibilities'), // Array of responsibilities
  preferredQualifications: jsonb('preferredQualifications'), // Array of nice-to-haves

  // Skills & Categories (for LLM searchability)
  skills: jsonb('skills'), // Array of required skills
  categories: jsonb('categories'), // Array of job categories (engineering, product, sales, etc.)
  tags: jsonb('tags'), // Additional searchable tags
  keywords: text('keywords'), // Full-text search keywords generated from content

  // Application Info
  applicationUrl: varchar('applicationUrl', { length: 512 }),
  applicationEmail: varchar('applicationEmail', { length: 256 }),
  applicationDeadline: timestamp('applicationDeadline'),

  // Metadata
  externalId: varchar('externalId', { length: 256 }), // ID from external job board
  source: varchar('source', { length: 64 }), // where job was sourced from
  sourceUrl: varchar('sourceUrl', { length: 512 }),

  // Status
  status: varchar('status', { length: 32 }).notNull().default('active'), // active, closed, draft, archived
  featured: boolean('featured').default(false),
  verified: boolean('verified').default(false),

  // Timestamps
  postedAt: timestamp('postedAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  expiresAt: timestamp('expiresAt'),

  // LLM-optimized fields
  embedding: jsonb('embedding'), // Vector embedding for semantic search
  aiSummary: text('aiSummary'), // AI-generated summary for quick understanding
  aiMatchCriteria: jsonb('aiMatchCriteria'), // Structured criteria for AI matching
}, (table) => ({
  // Indexes for efficient searching
  companyIdx: index('job_company_idx').on(table.companyId),
  statusIdx: index('job_status_idx').on(table.status),
  postedAtIdx: index('job_posted_at_idx').on(table.postedAt),
  companyStatusIdx: index('job_company_status_idx').on(table.companyId, table.status),
}));

export type Job = InferSelectModel<typeof job>;

// Job applications tracking
export const jobApplication = pgTable('JobApplication', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  jobId: uuid('jobId')
    .notNull()
    .references(() => job.id, { onDelete: 'cascade' }),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  status: varchar('status', { length: 32 }).notNull().default('draft'), // draft, submitted, reviewing, interviewed, offered, rejected, withdrawn
  stage: varchar('stage', { length: 64 }), // application, screening, phone, onsite, offer

  coverLetter: text('coverLetter'),
  resumeVersion: jsonb('resumeVersion'), // Snapshot of user's resume at time of application
  customAnswers: jsonb('customAnswers'), // Answers to custom questions

  notes: text('notes'), // User's notes

  appliedAt: timestamp('appliedAt'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  // Indexes
  userIdx: index('application_user_idx').on(table.userId),
  jobIdx: index('application_job_idx').on(table.jobId),
  userJobIdx: uniqueIndex('application_user_job_idx').on(table.userId, table.jobId),
}));

export type JobApplication = InferSelectModel<typeof jobApplication>;

// Job search preferences
export const jobSearchPreference = pgTable('JobSearchPreference', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),

  // Preferences
  desiredRoles: jsonb('desiredRoles'), // Array of role titles
  desiredCompanies: jsonb('desiredCompanies'), // Array of company IDs or names
  desiredLocations: jsonb('desiredLocations'), // Array of locations
  remotePreference: varchar('remotePreference', { length: 32 }), // remote-only, hybrid-ok, onsite-ok, any

  // Compensation expectations
  minSalary: integer('minSalary'),
  maxSalary: integer('maxSalary'),
  salaryCurrency: varchar('salaryCurrency', { length: 8 }).default('USD'),

  // Work preferences
  companySize: jsonb('companySize'), // Array of size preferences (startup, mid, enterprise)
  industries: jsonb('industries'), // Array of preferred industries
  jobTypes: jsonb('jobTypes'), // Array of job types (full-time, contract, etc.)
  experienceLevel: varchar('experienceLevel', { length: 32 }), // entry, mid, senior, lead, principal

  // Skills & interests
  skills: jsonb('skills'), // User's skills
  interests: jsonb('interests'), // Areas of interest

  // Search settings
  alertsEnabled: boolean('alertsEnabled').default(true),
  alertFrequency: varchar('alertFrequency', { length: 16 }).default('daily'), // realtime, daily, weekly

  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type JobSearchPreference = InferSelectModel<typeof jobSearchPreference>;

// Job interaction tracking (for recommendations)
export const jobInteraction = pgTable('JobInteraction', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  jobId: uuid('jobId')
    .notNull()
    .references(() => job.id, { onDelete: 'cascade' }),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  action: varchar('action', { length: 32 }).notNull(), // viewed, saved, applied, dismissed, shared
  context: jsonb('context'), // Additional context (search query, referrer, etc.)

  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  // Indexes
  userIdx: index('interaction_user_idx').on(table.userId),
  jobIdx: index('interaction_job_idx').on(table.jobId),
  actionIdx: index('interaction_action_idx').on(table.action),
}));

export type JobInteraction = InferSelectModel<typeof jobInteraction>;
