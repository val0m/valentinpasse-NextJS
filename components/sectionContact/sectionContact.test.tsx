import fs from "fs";
import path from "path";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SectionContact } from "./sectionContact";
import { getPortfolioContent } from "../../content/portfolioContent";
import {
  FINE_POINTER,
  NO_PREFERENCE,
  REDUCED_MOTION,
  mockMatchMedia,
} from "../../lib/testing/mockMatchMedia";

const contactStyles = fs.readFileSync(
  path.join(__dirname, "sectionContact.module.scss"),
  "utf8"
);

function contactCard(): HTMLElement {
  return document.querySelector("#contact [data-hologram-card]") as HTMLElement;
}

function countPointerBindings(): number {
  const addEventListener = jest.spyOn(EventTarget.prototype, "addEventListener");
  render(<SectionContact locale="fr" />);
  const section = document.querySelector("#contact");
  return addEventListener.mock.calls.filter(
    ([type], index) => type === "pointermove" && addEventListener.mock.contexts[index] === section
  ).length;
}

describe("SectionContact hologram card", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockMatchMedia(NO_PREFERENCE);
  });

  it("renders the contact copy inside a single hologram card", () => {
    render(<SectionContact locale="fr" />);

    const content = getPortfolioContent("fr").contact;
    const card = contactCard();
    expect(document.querySelectorAll("#contact [data-hologram-card]")).toHaveLength(1);
    expect(card).toContainElement(screen.getByRole("heading", { level: 2, name: content.title }));
    expect(card).toContainElement(screen.getByRole("link", { name: content.sendEmailAriaLabel }));
  });

  it("binds no pointer listener on a coarse pointer", () => {
    mockMatchMedia(NO_PREFERENCE);

    expect(countPointerBindings()).toBe(0);
  });

  it("binds no pointer listener under prefers-reduced-motion", () => {
    mockMatchMedia((query) => REDUCED_MOTION(query) || FINE_POINTER(query));

    expect(countPointerBindings()).toBe(0);
  });

  it("tracks the pointer on the card with a fine pointer", () => {
    mockMatchMedia(FINE_POINTER);
    expect(countPointerBindings()).toBe(1);

    const frames: FrameRequestCallback[] = [];
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    const card = contactCard();
    jest
      .spyOn(card, "getBoundingClientRect")
      .mockReturnValue({ left: 0, top: 0, width: 400, height: 200 } as DOMRect);

    const move = new Event("pointermove", { bubbles: true });
    Object.assign(move, { clientX: 300, clientY: 50, pointerType: "mouse" });
    fireEvent(card, move);
    frames.forEach((frame) => frame(0));

    expect(card.style.getPropertyValue("--tilt-x")).toBe("0.2500");
    expect(card.style.getPropertyValue("--tilt-y")).toBe("-0.2500");
  });

  it("reuses the shared hologram card with a 2.5° tilt", () => {
    expect(contactStyles).toMatch(/\.container \{\s*@include hologram\.card;\s*\}/);
    expect(contactStyles).toMatch(/--hologram-tilt-max: 2\.5deg;/);
  });
});
