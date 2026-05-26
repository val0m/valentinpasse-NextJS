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
