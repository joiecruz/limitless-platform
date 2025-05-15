
// Simple utility to check if we're on the apex domain
// We want to redirect from limitlesslab.org to www.limitlesslab.org
export const isApexDomain = (): boolean => {
  // Cache the hostname 
  const hostname = window.location.hostname;
  
  // Is this limitlesslab.org without a subdomain?
  return hostname === 'limitlesslab.org' || hostname === 'limitlesslab.com';
};
