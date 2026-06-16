import "@testing-library/jest-dom";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props as { src: unknown; alt?: string };
    const resolvedSrc = typeof src === "string" ? src : (src as { src?: string })?.src ?? "";
    return React.createElement("img", { src: resolvedSrc, alt: alt ?? "", ...rest });
  },
}));

jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href, ...rest }, children),
}));

// next/dynamic resolves lazily and would pull in the heavy Spline WebGL runtime;
// stub it to an inert component so hero tests stay fast and deterministic.
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const DynamicStub = () => null;
    DynamicStub.displayName = "DynamicStub";
    return DynamicStub;
  },
}));

// jsdom does not implement matchMedia; default to "motion allowed".
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
