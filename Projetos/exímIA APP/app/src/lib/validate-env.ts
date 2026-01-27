/**
 * Environment variables validation
 * Runs at app startup to ensure all required env vars are present
 */

interface RequiredEnv {
  name: string;
  variable: string;
}

const REQUIRED_ENV_VARS: RequiredEnv[] = [
  {
    name: 'Supabase URL',
    variable: 'NEXT_PUBLIC_SUPABASE_URL',
  },
  {
    name: 'Supabase Anon Key',
    variable: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  },
];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const env of REQUIRED_ENV_VARS) {
    const value = process.env[env.variable];
    if (!value || value.trim() === '') {
      missing.push(`${env.name} (${env.variable})`);
    }
  }

  if (missing.length > 0) {
    const error = `Missing required environment variables:\n${missing.map(m => `  - ${m}`).join('\n')}\n\nPlease check your .env.example file and configure .env with appropriate values.`;
    throw new Error(error);
  }
}
