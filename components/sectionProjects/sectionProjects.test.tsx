import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SectionProjects } from "./sectionProjects";
import { getPortfolioContent } from "../../content/portfolioContent";

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

/**
 * jsdom has no media queries; each test declares which ones match so the
 * binding guards of usePointerHologram can be exercised for real.
 */
function mockMatchMedia(matcher: (query: string) => boolean) {
  // jest.setup.ts installs matchMedia as writable but not configurable, so it is
  // reassigned rather than redefined.
  window.matchMedia = ((query: string) => ({
    matches: matcher(query),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const FINE_POINTER = (query: string) => query === "(hover: hover) and (pointer: fine)";
const COARSE_POINTER = () => false;
const REDUCED_MOTION = (query: string) =>
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
    mockMatchMedia(() => false);
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
        ([type], index) => type === "pointermove" && isGrid(addEventListener.mock.instances[index])
      ).length;
    }

    it("binds no pointer listener on a coarse pointer", () => {
      mockMatchMedia(COARSE_POINTER);

      expect(countPointerBindings()).toBe(0);
    });

    it("binds no pointer listener under prefers-reduced-motion", () => {
      mockMatchMedia(REDUCED_MOTION);

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
});
