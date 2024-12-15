import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Environment-specific configurations
const environments = {
  production: {
    url: "https://crllgygjuqpluvdpwayi.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8"
  },
  staging: {
    url: "https://cvwyaogwdnzxrbdogdje.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3lhb2d3ZG56eHJiZG9nZGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNTU4MDYsImV4cCI6MjA0OTgzMTgwNn0.ZOFop1-BCRQ2iVg2O9CbH1AXMVyMbYBKdJYhTJDXDqY"
  }
};

// Determine environment based on hostname
const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('staging')) {
    console.log('Using staging environment');
    return 'staging';
  }
  console.log('Using production environment');
  return 'production';
};

const environment = getEnvironment();
const config = environments[environment];

export const supabase = createClient<Database>(config.url, config.key);