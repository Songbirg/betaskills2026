const aliasMap: Record<string, string> = {
  'ai-and-human-relations': 'ai-human-relations',
  'podcast-management-101': 'podcast-management',
  'motor-mechanic-petrol': 'petrol-mechanic',
  'motor-mechanic-petrol-02': 'petrol-mechanic',
  'motor-mechanic-petrol-course': 'petrol-mechanic',
  'diesel-mechanic-course': 'diesel-mechanic',
  'motor-mechanic-diesel-course': 'motor-mechanic-diesel',
  'ai-cartoon-movie-making': 'ai-cartoon-movies',
  'ai-assisted-cartoon-movie-making': 'ai-cartoon-movies',
  'online-trading-financial-markets': 'online-trading',
};

export const resolveCourseId = (courseId?: string): string | undefined => {
  if (!courseId) return courseId;

  const trimmed = courseId.trim();
  const lower = trimmed.toLowerCase();

  return aliasMap[lower] ?? trimmed;
};

export const getCourseIdAliases = (courseId?: string): string[] => {
  if (!courseId) return [];

  const trimmed = courseId.trim();
  const lower = trimmed.toLowerCase();
  const resolved = resolveCourseId(trimmed) ?? trimmed;
  const resolvedLower = resolved.toLowerCase();

  const aliases = new Set<string>([trimmed, lower, resolved, resolvedLower]);

  for (const [alias, canonical] of Object.entries(aliasMap)) {
    if (canonical === resolved || canonical === resolvedLower) {
      aliases.add(alias);
    }
  }

  return Array.from(aliases);
};
