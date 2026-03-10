export type KbDoc = {
  id: string;
  title: string;
  sourceFile: string;
  content: string;
};

export type KbIndex = {
  version: number;
  generatedAt: string;
  docs: KbDoc[];
};

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

const tokenize = (s: string) => {
  const cleaned = normalize(s).replace(/[^a-z0-9\s]/g, ' ');
  return cleaned.split(' ').filter(Boolean).slice(0, 24);
};

export type KbHit = {
  doc: Pick<KbDoc, 'id' | 'title' | 'sourceFile'>;
  score: number;
  snippet: string;
};

export const searchKb = (index: KbIndex, query: string, limit = 5): KbHit[] => {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];

  const hits: KbHit[] = [];
  for (const d of index.docs) {
    const text = normalize(d.content);
    let score = 0;
    let bestPos = -1;

    for (const t of qTokens) {
      const pos = text.indexOf(t);
      if (pos !== -1) {
        score += 1;
        if (bestPos === -1 || pos < bestPos) bestPos = pos;
      }
    }

    if (score > 0) {
      const start = Math.max(0, bestPos - 180);
      const end = Math.min(text.length, bestPos + 420);
      const raw = d.content.slice(start, end).replace(/\s+/g, ' ').trim();
      hits.push({
        doc: { id: d.id, title: d.title, sourceFile: d.sourceFile },
        score,
        snippet: raw,
      });
    }
  }

  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const inferCourseFromText = (courses: { id: string; title: string }[], text: string) => {
  const hay = normalize(text);
  for (const c of courses) {
    const t = normalize(c.title);
    if (t && hay.includes(t)) return c;
  }
  return null;
};
