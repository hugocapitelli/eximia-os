import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnwxdjjsapcfiezktywj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZud3hkampzYXBjZmllemt0eXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Nzg2MTUsImV4cCI6MjA4NTM1NDYxNX0.UOaD5AhGECIAX3CuPi_1OHcDMxAw3pbLWtd88JuUX8M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCatalogView() {
  console.log('Testing catalog_view...');

  const { data, error, count } = await supabase
    .from('catalog_view')
    .select('*', { count: 'exact' });

  console.log('Error:', error);
  console.log('Count:', count);
  console.log('Data length:', data?.length);
  if (data) {
    data.forEach(row => {
      console.log(`  - ${row.id}: ${row.title} by ${row.author_name}`);
    });
  }
}

testCatalogView().catch(console.error);
