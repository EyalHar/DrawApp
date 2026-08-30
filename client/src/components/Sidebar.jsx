import './Sidebar.css';

function Sidebar({ lessons, currentView, onSelectHome, onSelectLesson }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">לומדים לצייר</div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={onSelectHome}
        >
          בית
        </button>
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            className={`sidebar-link ${currentView === lesson.id ? 'active' : ''}`}
            onClick={() => onSelectLesson(lesson.id)}
          >
            {lesson.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
