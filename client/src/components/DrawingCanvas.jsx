import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { sampleGuidePoints } from '../utils/matchDrawing';
import './DrawingCanvas.css';

function pointsToPathD(points) {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const [p] = points;
    return `M ${p.x},${p.y} L ${p.x},${p.y}`;
  }
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x},${prev.y} ${midX},${midY}`;
  }
  return d;
}

const DrawingCanvas = forwardRef(function DrawingCanvas(
  { viewBox, confirmedPaths, guidePathD, clearTrigger, interactive },
  ref
) {
  const svgRef = useRef(null);
  const guidePathRef = useRef(null);
  const drawingRef = useRef(false);
  const [strokes, setStrokes] = useState([]);
  const [activePoints, setActivePoints] = useState([]);

  useEffect(() => {
    setStrokes([]);
    setActivePoints([]);
  }, [clearTrigger]);

  useImperativeHandle(ref, () => ({
    getUserPoints() {
      return strokes.flat();
    },
    getGuidePoints(count = 120) {
      return sampleGuidePoints(guidePathRef.current, count);
    },
  }));

  function getSvgPoint(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function handlePointerDown(e) {
    if (!interactive) return;
    e.target.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = getSvgPoint(e);
    setActivePoints([{ x: p.x, y: p.y }]);
  }

  function handlePointerMove(e) {
    if (!interactive || !drawingRef.current) return;
    const p = getSvgPoint(e);
    setActivePoints((pts) => [...pts, { x: p.x, y: p.y }]);
  }

  function handlePointerUp() {
    if (!interactive || !drawingRef.current) return;
    drawingRef.current = false;
    setActivePoints((pts) => {
      if (pts.length > 0) {
        setStrokes((s) => [...s, pts]);
      }
      return [];
    });
  }

  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);

  return (
    <div className="drawing-canvas-wrap">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{ aspectRatio: `${vbWidth} / ${vbHeight}` }}
        className={`drawing-canvas ${interactive ? 'interactive' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {confirmedPaths.map((d, i) => (
          <path key={i} d={d} className="path-confirmed" />
        ))}
        {guidePathD && <path ref={guidePathRef} d={guidePathD} className="path-guide" />}
        {strokes.map((pts, i) => (
          <path key={i} d={pointsToPathD(pts)} className="path-user" />
        ))}
        {activePoints.length > 0 && <path d={pointsToPathD(activePoints)} className="path-user" />}
      </svg>
    </div>
  );
});

export default DrawingCanvas;
