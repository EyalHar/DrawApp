import './HomePage.css';

function HomePage({ lessons, onSelectLesson }) {
  return (
    <div className="home-page">
      <h1>מה מציירים היום?</h1>
      <p className="home-subtitle">בחרי ציור, ולמדי לצייר אותו שלב אחר שלב - קו אחרי קו.</p>
      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            className="lesson-card"
            onClick={() => onSelectLesson(lesson.id)}
          >
            <span className="lesson-card-title">{lesson.title}</span>
            <span className="lesson-card-steps">{lesson.stepCount} שלבים</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
