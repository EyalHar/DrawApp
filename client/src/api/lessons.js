const API_BASE = 'http://localhost:6100/api';

export async function fetchLessons() {
  const res = await fetch(`${API_BASE}/lessons`);
  if (!res.ok) throw new Error('Failed to fetch lessons');
  return res.json();
}

export async function fetchLesson(id) {
  const res = await fetch(`${API_BASE}/lessons/${id}`);
  if (!res.ok) throw new Error('Failed to fetch lesson');
  return res.json();
}
