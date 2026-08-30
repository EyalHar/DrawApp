import { Router } from 'express';
import { readdir, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.join(__dirname, '..', 'data', 'lessons');

const router = Router();

router.get('/', async (req, res) => {
  const files = await readdir(lessonsDir);
  const lessons = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map(async (file) => {
        const raw = await readFile(path.join(lessonsDir, file), 'utf-8');
        const lesson = JSON.parse(raw);
        return { id: lesson.id, title: lesson.title, emoji: lesson.emoji, stepCount: lesson.steps.length };
      })
  );
  res.json(lessons);
});

router.get('/:id', async (req, res) => {
  try {
    const raw = await readFile(path.join(lessonsDir, `${req.params.id}.json`), 'utf-8');
    res.json(JSON.parse(raw));
  } catch {
    res.status(404).json({ error: 'Lesson not found' });
  }
});

export default router;
