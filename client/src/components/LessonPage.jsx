import { useEffect, useRef, useState } from 'react';
import { fetchLesson } from '../api/lessons';
import { isAccurateEnough } from '../utils/matchDrawing';
import DrawingCanvas from './DrawingCanvas';
import './LessonPage.css';

const MAX_FAILED_ATTEMPTS = 3;

function LessonPage({ lessonId, onBack }) {
  const [lesson, setLesson] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [confirmedPaths, setConfirmedPaths] = useState([]);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setLesson(null);
    setStepIndex(0);
    setConfirmedPaths([]);
    setCompleted(false);
    setFailedAttempts(0);
    setFeedback(null);
    fetchLesson(lessonId).then(setLesson);
  }, [lessonId]);

  if (!lesson) {
    return <div className="lesson-loading">טוען...</div>;
  }

  const currentStep = lesson.steps[stepIndex];
  const activeViewBox = currentStep.viewBox || lesson.viewBox;

  function advanceStep() {
    setConfirmedPaths((paths) => [...paths, currentStep.pathD]);
    setClearTrigger((n) => n + 1);
    setFailedAttempts(0);
    setFeedback(null);
    if (stepIndex + 1 < lesson.steps.length) {
      setStepIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleNext() {
    const userPoints = canvasRef.current.getUserPoints();
    const guidePoints = canvasRef.current.getGuidePoints();
    const viewBoxWidth = Number(activeViewBox.split(' ')[2]);
    const result = isAccurateEnough(userPoints, guidePoints, viewBoxWidth);

    if (result.pass) {
      advanceStep();
    } else {
      setFailedAttempts((n) => n + 1);
      setFeedback(result.empty ? 'empty' : 'inaccurate');
    }
  }

  function handleSkip() {
    advanceStep();
  }

  function handleClear() {
    setClearTrigger((n) => n + 1);
    setFeedback(null);
  }

  function handleRestart() {
    setStepIndex(0);
    setConfirmedPaths([]);
    setClearTrigger((n) => n + 1);
    setCompleted(false);
    setFailedAttempts(0);
    setFeedback(null);
  }

  return (
    <div className="lesson-page">
      <button className="lesson-back" onClick={onBack}>
        → חזרה לבית
      </button>

      {completed ? (
        <div className="lesson-complete">
          <svg className="lesson-complete-check" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M14 25 L21 32 L34 17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1>סיימת לצייר {lesson.title}</h1>
          <DrawingCanvas
            viewBox={lesson.viewBox}
            confirmedPaths={confirmedPaths}
            guidePathD={null}
            clearTrigger={clearTrigger}
            interactive={false}
          />
          <div className="lesson-controls">
            <button className="btn btn-primary" onClick={handleRestart}>
              לצייר שוב
            </button>
            <button className="btn btn-secondary" onClick={onBack}>
              לציור אחר
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="lesson-header">
            <h1>{lesson.title}</h1>
            <div className="lesson-progress">
              שלב {stepIndex + 1} מתוך {lesson.steps.length}
            </div>
          </div>
          <p className="lesson-instruction">{currentStep.instruction}</p>
          {feedback && (
            <p className="lesson-feedback">
              {feedback === 'empty' ? 'קודם צריך לצייר על הקו.' : 'נסי שוב - עקבי קרוב יותר אחרי הקו.'}
            </p>
          )}
          <DrawingCanvas
            ref={canvasRef}
            viewBox={activeViewBox}
            confirmedPaths={confirmedPaths}
            guidePathD={currentStep.pathD}
            clearTrigger={clearTrigger}
            interactive={true}
          />
          <div className="lesson-controls">
            <button className="btn btn-secondary" onClick={handleClear}>
              נקה
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              הבא ←
            </button>
            {failedAttempts >= MAX_FAILED_ATTEMPTS && (
              <button className="btn btn-skip" onClick={handleSkip}>
                לדלג על השלב ←
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LessonPage;
