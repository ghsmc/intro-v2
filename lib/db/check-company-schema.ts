import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'node:path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL not found');
}

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function checkSchema() {
  try {
    const result = await client`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Company'
      ORDER BY ordinal_position
    `;

    console.log('Company table columns:');
    result.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSchema();