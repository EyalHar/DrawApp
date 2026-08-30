import express from 'express';
import cors from 'cors';
import lessonsRouter from './routes/lessons.js';

const app = express();
const PORT = process.env.PORT || 6100;

app.use(cors());
app.use('/api/lessons', lessonsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
