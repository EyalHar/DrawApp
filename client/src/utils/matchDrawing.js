export function sampleGuidePoints(pathEl, count = 120) {
  if (!pathEl) return [];
  const totalLength = pathEl.getTotalLength();
  const points = [];
  for (let i = 0; i < count; i++) {
    const len = (i / (count - 1)) * totalLength;
    const pt = pathEl.getPointAtLength(len);
    points.push({ x: pt.x, y: pt.y });
  }
  return points;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function scoreDrawing(userPoints, guidePoints, tolerance) {
  if (userPoints.length === 0 || guidePoints.length === 0) {
    return { coverage: 0, precision: 0, empty: true };
  }

  let coveredGuide = 0;
  for (const g of guidePoints) {
    const minD = Math.min(...userPoints.map((u) => distance(g, u)));
    if (minD <= tolerance) coveredGuide++;
  }

  let closeUser = 0;
  for (const u of userPoints) {
    const minD = Math.min(...guidePoints.map((g) => distance(g, u)));
    if (minD <= tolerance) closeUser++;
  }

  return {
    coverage: coveredGuide / guidePoints.length,
    precision: closeUser / userPoints.length,
    empty: false,
  };
}

export function isAccurateEnough(userPoints, guidePoints, viewBoxWidth, options = {}) {
  // Tuned for teens (~14yo) with solid fine motor control - tighter than the
  // original defaults, which were calibrated for ages 5-8.
  const {
    toleranceRatio = 0.035,
    minCoverage = 0.78,
    minPrecision = 0.65,
  } = options;
  const tolerance = viewBoxWidth * toleranceRatio;
  const { coverage, precision, empty } = scoreDrawing(userPoints, guidePoints, tolerance);
  return {
    pass: !empty && coverage >= minCoverage && precision >= minPrecision,
    coverage,
    precision,
    empty,
  };
}
