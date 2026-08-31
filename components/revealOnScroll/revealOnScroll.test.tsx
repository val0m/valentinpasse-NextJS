import React from "react";
import { render, screen, act } from "@testing-library/react";
import { RevealOnScroll } from "./revealOnScroll";

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

function mockMatchMedia(matches: boolean) {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("RevealOnScroll", () => {
  const originalMatchMedia = window.matchMedia;
  const originalIO = window.IntersectionObserver;
  let callbacks: IOCallback[];

  beforeEach(() => {
    callbacks = [];
    // Controllable IntersectionObserver so reveals can be driven deterministically.
    class MockIO {
      constructor(cb: IOCallback) {
        callbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    // @ts-expect-error assigning a test double
    window.IntersectionObserver = MockIO;
    window.matchMedia = mockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.IntersectionObserver = originalIO;
  });

  it("always renders its children so content stays readable regardless of reveal state", () => {
    render(
      <RevealOnScroll>
        <p>readable content</p>
      </RevealOnScroll>,
    );

    expect(screen.getByText("readable content")).toBeInTheDocument();
  });

  it("arms the hidden state off-screen, then reveals when the section intersects", () => {
    const { container } = render(
      <RevealOnScroll>
        <p>scroll content</p>
      </RevealOnScroll>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(callbacks).toHaveLength(1);

    // Reported off-screen first → hidden state armed, content still present.
    act(() => callbacks[0]([{ isIntersecting: false }]));
    expect(wrapper).toHaveClass("reveal");
    expect(wrapper).not.toHaveClass("visible");
    expect(screen.getByText("scroll content")).toBeInTheDocument();

    // Enters the viewport → revealed.
    act(() => callbacks[0]([{ isIntersecting: true }]));
    expect(wrapper).toHaveClass("visible");
  });

  it("never hides content (no observer) under prefers-reduced-motion", () => {
    window.matchMedia = mockMatchMedia(true);

    const { container } = render(
      <RevealOnScroll>
        <p>reduced motion</p>
      </RevealOnScroll>,
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(callbacks).toHaveLength(0);
    expect(wrapper).not.toHaveClass("reveal");
    expect(screen.getByText("reduced motion")).toBeInTheDocument();
  });
});
