import {
  DRIFT_RANGE,
  GRID_CELLS,
  MIN_RADIUS,
  NEIGHBOURS,
  RADIUS_SPREAD,
  NetworkPoint,
  advance,
  createField,
  distanceSq,
  drawField,
  easeInOutCirc,
  proximity,
} from "./networkField";

/** Deterministic PRNG (mulberry32) so fields are reproducible across runs. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fakeContext() {
  return {
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 0,
    globalAlpha: 1,
  };
}

describe("networkField", () => {
  describe("easeInOutCirc", () => {
    it("starts at 0, crosses 0.5 at mid-course and lands on 1", () => {
      expect(easeInOutCirc(0)).toBe(0);
      expect(easeInOutCirc(0.5)).toBeCloseTo(0.5);
      expect(easeInOutCirc(1)).toBe(1);
    });

    it("is monotonic", () => {
      const samples = Array.from({ length: 101 }, (_, i) => easeInOutCirc(i / 100));
      samples.slice(1).forEach((value, i) => expect(value).toBeGreaterThanOrEqual(samples[i]));
    });
  });

  describe("proximity", () => {
    it("lights the three rings from brightest to faintest, then nothing", () => {
      expect(proximity(0)).toEqual({ line: 0.5, dot: 0.95 });
      expect(proximity(10_000)).toEqual({ line: 0.22, dot: 0.6 });
      expect(proximity(30_000)).toEqual({ line: 0.07, dot: 0.28 });
      expect(proximity(40_000)).toEqual({ line: 0, dot: 0 });
    });
  });

  describe("createField", () => {
    const width = 1200;
    const height = 700;
    const field = createField(width, height, 0, seeded(42));

    it("lays out one jittered point per grid cell, inside the field", () => {
      expect(field).toHaveLength(GRID_CELLS * GRID_CELLS);
      field.forEach((point) => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThan(width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThan(height);
        expect(point.radius).toBeGreaterThanOrEqual(MIN_RADIUS);
        expect(point.radius).toBeLessThan(MIN_RADIUS + RADIUS_SPREAD);
      });
    });

    it("links every point to its nearest neighbours, never to itself", () => {
      field.forEach((point) => {
        expect(point.closest).toHaveLength(NEIGHBOURS);
        expect(point.closest).not.toContain(point);

        const farthestLinked = Math.max(...point.closest.map((n) => distanceSq(point, n)));
        const nearestUnlinked = Math.min(
          ...field
            .filter((other) => other !== point && !point.closest.includes(other))
            .map((other) => distanceSq(point, other))
        );
        expect(farthestLinked).toBeLessThanOrEqual(nearestUnlinked);
      });
    });

    it("aims every first drift within range of the point's origin", () => {
      field.forEach((point) => {
        expect(Math.abs(point.toX - point.originX)).toBeLessThanOrEqual(DRIFT_RANGE);
        expect(Math.abs(point.toY - point.originY)).toBeLessThanOrEqual(DRIFT_RANGE);
        expect(point.duration).toBeGreaterThanOrEqual(1000);
        expect(point.duration).toBeLessThan(2000);
      });
    });
  });

  describe("advance", () => {
    function singlePoint(): NetworkPoint {
      return {
        x: 100,
        y: 100,
        originX: 100,
        originY: 100,
        radius: 3,
        closest: [],
        fromX: 100,
        fromY: 100,
        toX: 140,
        toY: 60,
        start: 0,
        duration: 1000,
      };
    }

    it("moves a point along its drift, eased", () => {
      const point = singlePoint();

      advance([point], 500);

      expect(point.x).toBeCloseTo(120);
      expect(point.y).toBeCloseTo(80);
    });

    it("chains a new drift from where the last one ended", () => {
      const point = singlePoint();

      advance([point], 1500, () => 0.5);

      expect(point.fromX).toBe(140);
      expect(point.fromY).toBe(60);
      expect(point.x).toBe(140);
      expect(point.y).toBe(60);
      // random() = 0.5 aims right back at the origin, over 1.5 s.
      expect(point.toX).toBe(100);
      expect(point.toY).toBe(100);
      expect(point.start).toBe(1500);
      expect(point.duration).toBe(1500);
    });
  });

  describe("drawField", () => {
    it("draws nothing when the target is far from every point", () => {
      const ctx = fakeContext();
      const field = createField(800, 600, 0, seeded(7));

      drawField(ctx as unknown as CanvasRenderingContext2D, field, { x: -10_000, y: -10_000 }, "#fff");

      expect(ctx.stroke).not.toHaveBeenCalled();
      expect(ctx.fill).not.toHaveBeenCalled();
    });

    it("batches the lit points into one stroke and one fill per ring, plus the halo", () => {
      const ctx = fakeContext();
      const field = createField(800, 600, 0, seeded(7));

      drawField(ctx as unknown as CanvasRenderingContext2D, field, { x: 400, y: 300 }, "#93c5fd");

      expect(ctx.stroke.mock.calls.length).toBeGreaterThan(0);
      expect(ctx.stroke.mock.calls.length).toBeLessThanOrEqual(3);
      expect(ctx.fill.mock.calls.length).toBeLessThanOrEqual(4);
      expect(ctx.strokeStyle).toBe("#93c5fd");
      // Ring opacities must not leak into whatever is painted next.
      expect(ctx.globalAlpha).toBe(1);
    });
  });
});
