import { eq, and, desc, asc, ilike, or, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { company, type Company } from '../schema';

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getCompaniesByDomain({
  domainType,
  category,
  limit = 100,
  offset = 0,
}: {
  domainType: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE';
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(company.domainType, domainType)];

  if (category) {
    conditions.push(eq(company.category, category));
  }

  return await db
    .select()
    .from(company)
    .where(and(...conditions))
    .orderBy(asc(company.rank))
    .limit(limit)
    .offset(offset);
}

export async function searchCompanies({
  query,
  domainType,
}: {
  query: string;
  domainType?: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE';
}) {
  const searchPattern = `%${query}%`;

  const conditions = [
    or(
      ilike(company.name, searchPattern),
      ilike(company.description, searchPattern),
      ilike(company.industry, searchPattern),
      ilike(company.category, searchPattern),
    ),
  ];

  if (domainType) {
    conditions.push(eq(company.domainType, domainType));
  }

  return await db
    .select()
    .from(company)
    .where(and(...conditions))
    .orderBy(asc(company.rank))
    .limit(50);
}

export async function getCompanyById(id: string) {
  const [result] = await db
    .select()
    .from(company)
    .where(eq(company.id, id))
    .limit(1);

  return result;
}

export async function getCompanyCategories(domainType: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE') {
  const result = await db
    .select({
      category: company.category,
      count: sql<number>`COUNT(*)`,
    })
    .from(company)
    .where(eq(company.domainType, domainType))
    .groupBy(company.category)
    .orderBy(desc(sql`COUNT(*)`));

  return result;
}

export async function getFeaturedCompanies(domainType: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE') {
  return await db
    .select()
    .from(company)
    .where(
      and(
        eq(company.domainType, domainType),
        eq(company.featured, true)
      )
    )
    .orderBy(asc(company.rank))
    .limit(10);
}

export async function getTrendingCompanies(domainType: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE') {
  return await db
    .select()
    .from(company)
    .where(
      and(
        eq(company.domainType, domainType),
        eq(company.trending, 'up')
      )
    )
    .orderBy(asc(company.rank))
    .limit(10);
}

// Admin functions for seeding data
export async function upsertCompany(data: Partial<Company>) {
  const existingCompany = data.name && data.domainType
    ? await db
        .select()
        .from(company)
        .where(
          and(
            eq(company.name, data.name),
            eq(company.domainType, data.domainType)
          )
        )
        .limit(1)
    : [];

  if (existingCompany.length > 0 && existingCompany[0]) {
    // Update existing company
    await db
      .update(company)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(company.id, existingCompany[0].id));

    return existingCompany[0].id;
  } else {
    // Insert new company
    const [newCompany] = await db
      .insert(company)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Company)
      .returning({ id: company.id });

    return newCompany.id;
  }
}

export async function bulkUpsertCompanies(companies: Partial<Company>[]) {
  const results = [];
  for (const companyData of companies) {
    const id = await upsertCompany(companyData);
    results.push(id);
  }
  return results;
}