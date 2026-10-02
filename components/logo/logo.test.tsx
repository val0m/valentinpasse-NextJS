import React from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";

const pathData = (svg: ParentNode) =>
  Array.from(svg.querySelectorAll("path")).map((path) => path.getAttribute("d"));

describe("Logo", () => {
  it("exposes the brand name as an image by default", () => {
    render(<Logo />);

    expect(screen.getByRole("img", { name: "Valentin Passe" })).toBeInTheDocument();
  });

  it("is hidden from assistive tech when decorative", () => {
    const { container } = render(<Logo decorative />);

    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("draws the same paths as the favicon (public/icon.svg)", () => {
    const { container } = render(<Logo />);
    const favicon = new DOMParser().parseFromString(
      readFileSync(join(__dirname, "../../public/icon.svg"), "utf8"),
      "image/svg+xml"
    );

    expect(pathData(container)).toHaveLength(3);
    expect(pathData(favicon)).toEqual(pathData(container));
  });
});
