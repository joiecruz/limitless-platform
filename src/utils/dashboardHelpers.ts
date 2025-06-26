
export const getDisplayName = (profile: any) => {
  if (profile?.first_name || profile?.last_name) {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  }
  return '';
};
