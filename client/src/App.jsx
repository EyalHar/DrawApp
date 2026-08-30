import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LessonPage from './components/LessonPage';
import { fetchLessons } from './api/lessons';
import './App.css';

function App() {
  const [lessons, setLessons] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  useEffect(() => {
    fetchLessons()
      .then(setLessons)
      .catch(() => setLessons([]));
  }, []);

  return (
    <div className="app">
      <Sidebar
        lessons={lessons}
        currentView={currentLessonId ?? 'home'}
        onSelectHome={() => setCurrentLessonId(null)}
        onSelectLesson={setCurrentLessonId}
      />
      <main className="app-main">
        {currentLessonId ? (
          <LessonPage lessonId={currentLessonId} onBack={() => setCurrentLessonId(null)} />
        ) : (
          <HomePage lessons={lessons} onSelectLesson={setCurrentLessonId} />
        )}
      </main>
    </div>
  );
}

export default App;
