/**
 * Script to run database migrations
 * Usage: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('📝 Loading migration file...');
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/011_biblioteca_catalog.sql'
    );

    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log(`✓ Loaded ${sql.length} bytes of SQL`);

    // Split by semicolons to execute as separate statements
    // (supabase-js doesn't support multi-statement queries well)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing...`);

      const { error } = await supabase.rpc('exec_sql', {
        query: stmt + ';'
      });

      if (error) {
        console.error(`❌ Error:`, error.message);
        // Continue anyway - some statements might create views/functions that conflict
        if (!error.message.includes('already exists')) {
          throw error;
        }
      } else {
        console.log('✓ Success');
      }
    }

    console.log('\n✅ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
