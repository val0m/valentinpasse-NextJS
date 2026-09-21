import React from "react";
import { render } from "@testing-library/react";
import { HeroNetworkBackground } from "./heroNetworkBackground";
import {
  FINE_POINTER,
  NO_PREFERENCE,
  REDUCED_MOTION,
  mockMatchMedia,
} from "../../lib/testing/mockMatchMedia";

type ObserverCallback = (entries: Array<Record<string, unknown>>) => void;

let resizeCallback: ObserverCallback | null = null;
let intersectionCallback: ObserverCallback | null = null;

class ResizeObserverFake {
  constructor(callback: ObserverCallback) {
    resizeCallback = callback;
  }
  observe() {}
  disconnect() {}
}

class IntersectionObserverFake {
  constructor(callback: ObserverCallback) {
    intersectionCallback = callback;
  }
  observe() {}
  disconnect() {}
}

function fakeContext() {
  return {
    clearRect: jest.fn(),
    setTransform: jest.fn(),
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

/** Mounts inside a host element, as in the hero, and sizes the canvas. */
function mount() {
  const utils = render(
    <section>
      <HeroNetworkBackground />
    </section>
  );
  resizeCallback?.([{ contentRect: { width: 1000, height: 600 } }]);
  return utils;
}

describe("HeroNetworkBackground", () => {
  let ctx: ReturnType<typeof fakeContext>;
  let requestFrame: jest.SpyInstance;
  let cancelFrame: jest.SpyInstance;
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    ctx = fakeContext();
    jest
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    requestFrame = jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    cancelFrame = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    Object.assign(globalThis, {
      ResizeObserver: ResizeObserverFake,
      IntersectionObserver: IntersectionObserverFake,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockMatchMedia(NO_PREFERENCE);
    resizeCallback = null;
    intersectionCallback = null;
    delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    Object.assign(globalThis, { IntersectionObserver: originalIntersectionObserver });
  });

  it("renders a canvas hidden from assistive technologies", () => {
    const { container } = mount();

    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
  });

  it("sizes the backing store to the hero, at the device pixel ratio", () => {
    const { container } = mount();
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(600);
    expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
  });

  it("only runs the frame loop while the hero is in view", () => {
    mount();
    expect(requestFrame).not.toHaveBeenCalled();

    intersectionCallback?.([{ isIntersecting: true }]);
    expect(requestFrame).toHaveBeenCalledTimes(1);

    intersectionCallback?.([{ isIntersecting: false }]);
    expect(cancelFrame).toHaveBeenCalled();
  });

  it("cancels the pending frame on unmount", () => {
    const { unmount } = mount();
    intersectionCallback?.([{ isIntersecting: true }]);

    unmount();

    expect(cancelFrame).toHaveBeenCalledWith(1);
  });

  it("paints a single still frame and never loops under reduced motion", () => {
    mockMatchMedia(REDUCED_MOTION);
    mount();
    intersectionCallback?.([{ isIntersecting: true }]);

    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(ctx.stroke).toHaveBeenCalled();
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("tracks the pointer on its host only with a fine pointer", () => {
    const addListener = jest.spyOn(HTMLElement.prototype, "addEventListener");
    // React binds its own delegated listeners on the render root; only count the
    // ones bound on the hosting section.
    const hostMoves = () =>
      addListener.mock.calls.filter(
        ([type], call) =>
          type === "pointermove" &&
          (addListener.mock.contexts[call] as HTMLElement).tagName === "SECTION"
      );

    mount();
    expect(hostMoves()).toHaveLength(0);

    mockMatchMedia(FINE_POINTER);
    mount();
    expect(hostMoves()).toHaveLength(1);
  });

  it("stays inert when no 2D context is available", () => {
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(() => mount()).not.toThrow();
    expect(resizeCallback).toBeNull();
  });
});
