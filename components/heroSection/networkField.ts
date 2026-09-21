/**
 * Pure engine behind the hero's animated network background — a dependency-free
 * port of the Codrops "Animated Header Backgrounds" demo 1, which relied on
 * TweenLite + EasePack (GSAP 1.x) and a requestAnimationFrame polyfill.
 *
 * A jittered grid of points slowly drifts around each point's origin; every
 * point is wired to its nearest neighbours, and only the points close to a
 * target (the pointer) light up, with their links, in three fading rings.
 *
 * Everything here works in CSS pixels and takes time and randomness as inputs,
 * so it stays deterministic under test. The React side owns the canvas, the
 * device-pixel ratio and the animation loop.
 */

/** The field is a GRID_CELLS × GRID_CELLS jittered grid, whatever its size. */
export const GRID_CELLS = 20;

/** How many nearest neighbours each point is linked to. */
export const NEIGHBOURS = 5;

/** Each drift wanders at most this far from the point's origin, per axis. */
export const DRIFT_RANGE = 50;

/**
 * Brightness rings around the target, from the innermost out. Distances are
 * compared squared (as in the original demo), so 4 000 / 20 000 / 40 000 px²
 * are rings of roughly 63 / 141 / 200 px. Opacities sit above the original
 * demo's (0.3 / 0.1 / 0.02 and 0.6 / 0.3 / 0.1) for a brighter mesh.
 */
export const PROXIMITY_LEVELS = [
  { maxDistanceSq: 4_000, line: 0.5, dot: 0.95 },
  { maxDistanceSq: 20_000, line: 0.22, dot: 0.6 },
  { maxDistanceSq: 40_000, line: 0.07, dot: 0.28 },
] as const;

/** Dot radius range, in CSS pixels: MIN_RADIUS up to MIN_RADIUS + RADIUS_SPREAD. */
export const MIN_RADIUS = 2.5;
export const RADIUS_SPREAD = 2.5;

/**
 * Soft halo painted around the dots of the innermost ring only, so the spot
 * under the pointer glows without any per-frame blur (no `shadowBlur`).
 */
export const HALO = { scale: 2.6, alpha: 0.16 } as const;

export type Vector = { x: number; y: number };

export type NetworkPoint = Vector & {
  originX: number;
  originY: number;
  radius: number;
  closest: NetworkPoint[];
  /** Current drift tween, in the same clock as the `now` passed to `advance`. */
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  start: number;
  duration: number;
};

type Random = () => number;

export function distanceSq(a: Vector, b: Vector): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

/** GSAP's `Circ.easeInOut`, which gives the drift its slow-fast-slow rhythm. */
export function easeInOutCirc(t: number): number {
  return t < 0.5
    ? (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2
    : (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2;
}

/** Opacity of a point's links and dot for a given squared distance to the target. */
export function proximity(distanceToTargetSq: number): { line: number; dot: number } {
  const level = PROXIMITY_LEVELS.find(({ maxDistanceSq }) => distanceToTargetSq < maxDistanceSq);
  return level ? { line: level.line, dot: level.dot } : { line: 0, dot: 0 };
}

/** Starts a fresh drift toward a random spot within `DRIFT_RANGE` of the origin. */
function scheduleDrift(point: NetworkPoint, now: number, random: Random): void {
  point.fromX = point.x;
  point.fromY = point.y;
  point.toX = point.originX - DRIFT_RANGE + random() * DRIFT_RANGE * 2;
  point.toY = point.originY - DRIFT_RANGE + random() * DRIFT_RANGE * 2;
  point.start = now;
  // 1 to 2 seconds, as in the original.
  point.duration = 1000 + 1000 * random();
}

/**
 * Builds the jittered grid and links each point to its `NEIGHBOURS` nearest
 * peers. The neighbour search is O(n²) over 400 points — a one-off cost of a
 * fraction of a millisecond per (re)build, never paid per frame.
 */
export function createField(
  width: number,
  height: number,
  now: number,
  random: Random = Math.random
): NetworkPoint[] {
  const cellWidth = width / GRID_CELLS;
  const cellHeight = height / GRID_CELLS;
  const points: NetworkPoint[] = [];

  for (let column = 0; column < GRID_CELLS; column++) {
    for (let row = 0; row < GRID_CELLS; row++) {
      const x = column * cellWidth + random() * cellWidth;
      const y = row * cellHeight + random() * cellHeight;
      const point: NetworkPoint = {
        x,
        y,
        originX: x,
        originY: y,
        radius: MIN_RADIUS + random() * RADIUS_SPREAD,
        closest: [],
        fromX: x,
        fromY: y,
        toX: x,
        toY: y,
        start: now,
        duration: 0,
      };
      scheduleDrift(point, now, random);
      points.push(point);
    }
  }

  for (const point of points) {
    point.closest = points
      .filter((other) => other !== point)
      .sort((a, b) => distanceSq(point, a) - distanceSq(point, b))
      .slice(0, NEIGHBOURS);
  }

  return points;
}

/** Moves every point along its drift, chaining a new drift when one ends. */
export function advance(points: NetworkPoint[], now: number, random: Random = Math.random): void {
  for (const point of points) {
    let progress = point.duration > 0 ? (now - point.start) / point.duration : 1;
    if (progress >= 1) {
      point.x = point.toX;
      point.y = point.toY;
      scheduleDrift(point, now, random);
      progress = 0;
    }
    const eased = easeInOutCirc(Math.max(progress, 0));
    point.x = point.fromX + (point.toX - point.fromX) * eased;
    point.y = point.fromY + (point.toY - point.fromY) * eased;
  }
}

/**
 * Paints the lit part of the field. Links and dots are batched into one path
 * per brightness ring (plus one for the inner halo), so a frame costs at most
 * seven strokes/fills however many points are lit — instead of one per link as
 * in the original demo.
 *
 * `color` is any CSS colour; ring opacities go through `globalAlpha`, so the
 * tint can come straight from a design token.
 */
export function drawField(
  ctx: CanvasRenderingContext2D,
  points: NetworkPoint[],
  target: Vector,
  color: string
): void {
  const byLevel = PROXIMITY_LEVELS.map(() => [] as NetworkPoint[]);

  for (const point of points) {
    const d = distanceSq(target, point);
    const index = PROXIMITY_LEVELS.findIndex(({ maxDistanceSq }) => d < maxDistanceSq);
    if (index !== -1) {
      byLevel[index].push(point);
    }
  }

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

  const innermost = byLevel[0];
  if (innermost.length > 0) {
    ctx.globalAlpha = HALO.alpha;
    ctx.beginPath();
    for (const point of innermost) {
      const haloRadius = point.radius * HALO.scale;
      ctx.moveTo(point.x + haloRadius, point.y);
      ctx.arc(point.x, point.y, haloRadius, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  PROXIMITY_LEVELS.forEach((level, index) => {
    const lit = byLevel[index];
    if (lit.length === 0) {
      return;
    }

    ctx.globalAlpha = level.line;
    ctx.beginPath();
    for (const point of lit) {
      for (const neighbour of point.closest) {
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(neighbour.x, neighbour.y);
      }
    }
    ctx.stroke();

    ctx.globalAlpha = level.dot;
    ctx.beginPath();
    for (const point of lit) {
      ctx.moveTo(point.x + point.radius, point.y);
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    }
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}
