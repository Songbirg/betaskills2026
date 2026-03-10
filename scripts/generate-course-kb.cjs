/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.join(projectRoot, 'CourseDocuments');
const outFile = path.join(projectRoot, 'public', 'course-kb.json');

const MAX_DOC_CHARS = 24000;

const safeReadText = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return '';
  }
};

const normalizeTitle = (fileName) => {
  return String(fileName)
    .replace(/\.(md|txt)$/i, '')
    .replace(/\.docx\.md$/i, '')
    .replace(/\.docx\.txt$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const main = () => {
  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    docs: [],
  };

  try {
    if (!fs.existsSync(docsDir)) {
      console.warn(`[kb] CourseDocuments not found at: ${docsDir}`);
    } else {
      const entries = fs.readdirSync(docsDir, { withFileTypes: true });
      const files = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((n) => /\.(md|txt)$/i.test(n))
        .sort((a, b) => a.localeCompare(b));

      for (const fileName of files) {
        const filePath = path.join(docsDir, fileName);
        const raw = safeReadText(filePath);
        const content = String(raw || '').replace(/\u0000/g, '').trim();
        if (!content) continue;

        index.docs.push({
          id: fileName,
          title: normalizeTitle(fileName),
          sourceFile: fileName,
          content: content.slice(0, MAX_DOC_CHARS),
        });
      }

      console.log(`[kb] Loaded ${index.docs.length} docs from CourseDocuments`);
    }
  } catch (e) {
    console.warn('[kb] Failed to build knowledge base:', e);
  }

  try {
    const dir = path.dirname(outFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(index), 'utf8');
    console.log(`[kb] Wrote: ${outFile}`);
  } catch (e) {
    console.warn('[kb] Failed to write knowledge base file:', e);
  }

  return 0;
};

process.exitCode = main();
