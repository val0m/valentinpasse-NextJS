import fs from "fs";
import path from "path";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SectionProjects } from "./sectionProjects";
import { getPortfolioContent } from "../../content/portfolioContent";
import {
  FINE_POINTER,
  NO_PREFERENCE,
  mockMatchMedia,
} from "../../lib/testing/mockMatchMedia";

jest.mock("../../content/portfolioContent", () => {
  const actual = jest.requireActual("../../content/portfolioContent");
  return { ...actual, getPortfolioContent: jest.fn(actual.getPortfolioContent) };
});

const getPortfolioContentMock = getPortfolioContent as jest.MockedFunction<
  typeof getPortfolioContent
>;

const frContent = jest
  .requireActual<typeof import("../../content/portfolioContent")>("../../content/portfolioContent")
  .getPortfolioContent("fr");
const frProjects = frContent.projects;

const projectStyles = fs.readFileSync(
  path.join(__dirname, "sectionProjects.module.scss"),
  "utf8"
);

/** A hybrid machine: fine pointer available, but reduced motion requested. */
const FINE_POINTER_REDUCED_MOTION = (query: string) =>
  query === "(prefers-reduced-motion: reduce)" || FINE_POINTER(query);

/**
 * jsdom implements neither PointerEvent nor the mouse coordinate properties on
 * a bare Event, so the payload is attached explicitly instead of relying on an
 * event-init the constructor would silently drop.
 */
function firePointer(
  target: Element,
  type: "pointermove" | "pointerleave",
  payload: Record<string, unknown> = {}
) {
  const event = new Event(type, { bubbles: type === "pointermove" });
  Object.assign(event, payload);
  fireEvent(target, event);
}

function firstCard() {
  return document.querySelector("[data-hologram-card]") as HTMLElement;
}

describe("SectionProjects", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    getPortfolioContentMock.mockImplementation(
      jest.requireActual<typeof import("../../content/portfolioContent")>(
        "../../content/portfolioContent"
      ).getPortfolioContent
    );
    mockMatchMedia(NO_PREFERENCE);
  });

  describe("content exposure", () => {
    beforeEach(() => mockMatchMedia(FINE_POINTER));

    it("exposes every title, summary and outcome without any interaction", () => {
      render(<SectionProjects locale="fr" />);

      frProjects.items.forEach((project) => {
        expect(screen.getByRole("heading", { level: 3, name: project.title })).toBeVisible();
        expect(screen.getByText(project.summary)).toBeVisible();
        expect(screen.getByText(project.outcome)).toBeVisible();
      });
    });

    it("keeps context and contribution in the document while the disclosure is collapsed", () => {
      render(<SectionProjects locale="fr" />);

      const [firstProject] = frProjects.items;
      const details = screen.getAllByText(frProjects.disclosureLabel)[0].closest("details");
      expect(details).not.toHaveAttribute("open");

      // Collapsed, not removed: the copy stays crawlable.
      expect(screen.getByText(firstProject.context)).toBeInTheDocument();
      expect(screen.getByText(firstProject.contribution)).toBeInTheDocument();
    });

    it("exposes the expanded state when a disclosure is toggled", () => {
      render(<SectionProjects locale="fr" />);

      const summary = screen.getAllByText(frProjects.disclosureLabel)[0];
      const details = summary.closest("details") as HTMLDetailsElement;
      expect(details).not.toHaveAttribute("open");

      fireEvent.click(summary);

      expect(details).toHaveAttribute("open");
    });

    it("renders the section CTAs and one labelled tag list per project", () => {
      render(<SectionProjects locale="fr" />);

      expect(
        screen.getByRole("link", { name: frProjects.primaryAction.label })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: frProjects.secondaryAction.label })
      ).toBeInTheDocument();
      expect(screen.getAllByLabelText(frProjects.tagsAriaLabel)).toHaveLength(
        frProjects.items.length
      );
    });

    it("does not render a project missing its title or its summary", () => {
      getPortfolioContentMock.mockReturnValue({
        ...frContent,
        projects: {
          ...frProjects,
          items: [
            frProjects.items[0],
            { ...frProjects.items[1], title: "  " },
            { ...frProjects.items[2], summary: "" },
          ],
        },
      });

      render(<SectionProjects locale="fr" />);

      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
      expect(document.querySelectorAll("[data-hologram-card]")).toHaveLength(1);
    });

    it("stays in parity on the English route", () => {
      const enProjects = getPortfolioContent("en").projects;
      render(<SectionProjects locale="en" />);

      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(enProjects.items.length);
      expect(screen.getAllByText(enProjects.disclosureLabel)).toHaveLength(enProjects.items.length);
      enProjects.items.forEach((project) => {
        expect(screen.getByText(project.outcome)).toBeVisible();
      });
    });
  });

  describe("external links", () => {
    beforeEach(() => mockMatchMedia(FINE_POINTER));

    it("emits no external link when no project declares a public one", () => {
      // Guards the confidentiality constraint: none of the three engagements has
      // a publishable URL today, so the section must stay link-free.
      expect(frProjects.items.every((project) => !project.publicLink)).toBe(true);

      render(<SectionProjects locale="fr" />);

      expect(
        screen.queryByRole("link", { name: frProjects.externalLinkLabel })
      ).not.toBeInTheDocument();
    });

    it("renders a hardened, labelled link for a project declaring a public one", () => {
      const project = frProjects.items[0];
      getPortfolioContentMock.mockReturnValue({
        ...frContent,
        projects: {
          ...frProjects,
          items: [{ ...project, publicLink: "https://example.com" }],
        },
      });

      render(<SectionProjects locale="fr" />);

      const link = screen.getByRole("link", {
        name: frProjects.externalLinkAriaTemplate.replace("{title}", project.title),
      });
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it.each(["http://example.com", "/somewhere", "example.com", "javascript:alert(1)"])(
      "never emits a link for the non-absolute-https value %s",
      (publicLink) => {
        getPortfolioContentMock.mockReturnValue({
          ...frContent,
          projects: {
            ...frProjects,
            items: [{ ...frProjects.items[0], publicLink }],
          },
        });

        render(<SectionProjects locale="fr" />);

        const externalLinkName = frProjects.externalLinkAriaTemplate.replace(
          "{title}",
          frProjects.items[0].title
        );
        expect(screen.queryByRole("link", { name: externalLinkName })).not.toBeInTheDocument();
      }
    );
  });

  describe("pointer hologram binding guards", () => {
    // React delegates its own pointermove listener on the test root, which also
    // contains the cards; only the element that directly parents them is ours.
    const isGrid = (node: unknown): node is HTMLElement =>
      node instanceof HTMLElement &&
      node.firstElementChild?.hasAttribute("data-hologram-card") === true;

    function countPointerBindings() {
      const addEventListener = jest.spyOn(EventTarget.prototype, "addEventListener");
      render(<SectionProjects locale="fr" />);
      return addEventListener.mock.calls.filter(
        // `contexts` is the documented accessor for a call's `this`.
        ([type], index) => type === "pointermove" && isGrid(addEventListener.mock.contexts[index])
      ).length;
    }

    it("binds no pointer listener on a coarse pointer", () => {
      mockMatchMedia(NO_PREFERENCE);

      expect(countPointerBindings()).toBe(0);
    });

    it("binds no pointer listener under prefers-reduced-motion", () => {
      mockMatchMedia(FINE_POINTER_REDUCED_MOTION);

      expect(countPointerBindings()).toBe(0);
    });

    it("binds a single delegated listener on a fine pointer", () => {
      mockMatchMedia(FINE_POINTER);

      // One listener for the whole grid — never one per card.
      expect(countPointerBindings()).toBe(1);
    });
  });

  describe("pointer hologram writes", () => {
    beforeEach(() => mockMatchMedia(FINE_POINTER));

    it("coalesces a burst of moves into a single frame and writes the last position", () => {
      render(<SectionProjects locale="fr" />);

      const frames: FrameRequestCallback[] = [];
      jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((callback: FrameRequestCallback) => {
          frames.push(callback);
          return frames.length;
        });

      const card = firstCard();
      const grid = card.parentElement as HTMLElement;
      jest.spyOn(card, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
      } as DOMRect);

      firePointer(card, "pointermove", { clientX: 10, clientY: 10, pointerType: "mouse" });
      firePointer(card, "pointermove", { clientX: 50, clientY: 50, pointerType: "mouse" });
      firePointer(card, "pointermove", { clientX: 150, clientY: 75, pointerType: "mouse" });

      // One frame for three moves — never one style write per event.
      expect(frames).toHaveLength(1);

      frames[0](0);

      expect(card.style.getPropertyValue("--mx")).toBe("75.00%");
      expect(card.style.getPropertyValue("--my")).toBe("75.00%");
      expect(card.style.getPropertyValue("--tilt-x")).toBe("0.2500");
      expect(card.style.getPropertyValue("--tilt-y")).toBe("0.2500");

      // Leaving the grid clears the card so it never stays tilted.
      firePointer(grid, "pointerleave");
      expect(card.style.getPropertyValue("--mx")).toBe("");
      expect(card.style.getPropertyValue("--tilt-x")).toBe("");
    });

    it("ignores touch-originated moves on hybrid devices", () => {
      render(<SectionProjects locale="fr" />);

      const requestAnimationFrame = jest.spyOn(window, "requestAnimationFrame");
      firePointer(firstCard(), "pointermove", {
        clientX: 10,
        clientY: 10,
        pointerType: "touch",
      });

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  /*
   * The CSS half of the guardrails. jsdom loads no stylesheet — CSS-module
   * classes are mapped to their own name by identity-obj-proxy — so
   * getComputedStyle would report nothing. Asserting on the source is the only
   * lever available, and these rules are exactly the ones the issue calls
   * non-negotiable.
   */
  describe("stylesheet guardrails", () => {
    const reducedMotionBlock = projectStyles.match(
      /^@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)^\}/m
    )?.[1];

    it("suppresses tilt, spotlight and border animation under prefers-reduced-motion", () => {
      expect(reducedMotionBlock).toBeDefined();
      expect(reducedMotionBlock).toMatch(/\.card \{[^}]*transform: none;/);
      expect(reducedMotionBlock).toMatch(/opacity: 0;/);
      expect(reducedMotionBlock).toMatch(/animation: none;/);
    });

    it("declares the reduced-motion override after the fine-pointer block, so it wins", () => {
      // Same specificity: source order decides.
      expect(projectStyles.indexOf("@media (prefers-reduced-motion: reduce)")).toBeGreaterThan(
        projectStyles.indexOf("@media (hover: hover) and (pointer: fine)")
      );
    });

    it("binds tilt only inside the fine-pointer block", () => {
      const finePointerBlock = projectStyles.match(
        /^@media \(hover: hover\) and \(pointer: fine\) \{([\s\S]*?)^\}/m
      )?.[1];

      expect(finePointerBlock).toMatch(/transform: perspective\(900px\)/);
      // Capped at 6°, per the issue.
      expect(finePointerBlock).toMatch(/\* -6deg/);
      expect(finePointerBlock).toMatch(/\* 6deg/);
      expect(projectStyles.match(/transform: perspective\(/g)).toHaveLength(1);
    });

    it("never uses --color-accent for text on the dark band", () => {
      // #2563eb fails 4.5:1 here; accents must use --color-accent-on-dark.
      expect(projectStyles).not.toMatch(/(^|[^-])color:\s*var\(--color-accent\)/m);
    });
  });
});
