import fs from "fs";
import path from "path";
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { SectionWebsites } from "./sectionWebsites";
import { STACK_STEP_PX, STACK_TOP_PX } from "./useStackDepth";
import { getPortfolioContent } from "../../content/portfolioContent";
import {
  FINE_POINTER,
  NO_PREFERENCE,
  REDUCED_MOTION,
  mockMatchMedia,
} from "../../lib/testing/mockMatchMedia";

jest.mock("../../content/portfolioContent", () => {
  const actual = jest.requireActual("../../content/portfolioContent");
  return { ...actual, getPortfolioContent: jest.fn(actual.getPortfolioContent) };
});

const getPortfolioContentMock = getPortfolioContent as jest.MockedFunction<
  typeof getPortfolioContent
>;

const actualContent = jest.requireActual<typeof import("../../content/portfolioContent")>(
  "../../content/portfolioContent"
);
const frContent = actualContent.getPortfolioContent("fr");
const frWebsites = frContent.websites;

const websiteStyles = fs.readFileSync(
  path.join(__dirname, "sectionWebsites.module.scss"),
  "utf8"
);

/** A hybrid machine: fine pointer available, but reduced motion requested. */
const FINE_POINTER_REDUCED_MOTION = (query: string) =>
  REDUCED_MOTION(query) || FINE_POINTER(query);

function stackCards(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-stack-card]"));
}

function setOffsetHeight(element: HTMLElement, height: number) {
  Object.defineProperty(element, "offsetHeight", { configurable: true, value: height });
}

function setTop(element: HTMLElement, top: number) {
  jest.spyOn(element, "getBoundingClientRect").mockReturnValue({ top } as DOMRect);
}

/** Collects rAF callbacks so a test flushes frames when it chooses. */
function captureFrames(): FrameRequestCallback[] {
  const frames: FrameRequestCallback[] = [];
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  return frames;
}

/** Runs and drops every pending frame, e.g. the one requested on mount. */
function flushFrames(frames: FrameRequestCallback[]) {
  frames.splice(0).forEach((frame) => frame(0));
}

describe("SectionWebsites", () => {
  const initialInnerHeight = window.innerHeight;

  afterEach(() => {
    jest.restoreAllMocks();
    getPortfolioContentMock.mockImplementation(actualContent.getPortfolioContent);
    mockMatchMedia(NO_PREFERENCE);
    window.innerHeight = initialInnerHeight;
  });

  describe("content exposure", () => {
    beforeEach(() => mockMatchMedia(FINE_POINTER));

    it("renders both web works, each with its year in the type line", () => {
      render(<SectionWebsites locale="fr" />);

      expect(frWebsites.items).toHaveLength(2);
      frWebsites.items.forEach((site) => {
        expect(site.year).toBe(2026);
        const card = screen.getByRole("article", { name: site.title });
        expect(within(card).getByText(`${site.kind} · ${site.year}`)).toBeVisible();
      });
      expect(screen.getByText("Site vitrine · 7 pages · 2026")).toBeInTheDocument();
    });

    it("exposes summary, outcome and tags without any interaction", () => {
      render(<SectionWebsites locale="fr" />);

      frWebsites.items.forEach((site) => {
        const card = screen.getByRole("article", { name: site.title });
        expect(within(card).getByText(site.summary)).toBeVisible();
        expect(within(card).getByText(site.outcome)).toBeVisible();
        expect(within(card).getByText(frWebsites.outcomeLabel)).toBeVisible();

        const tags = within(card).getByRole("list", { name: frWebsites.tagsAriaLabel });
        expect(within(tags).getAllByRole("listitem").map((item) => item.textContent)).toEqual(
          site.stack
        );
      });
    });

    it("keeps the technical choices in the document while the disclosure is collapsed", () => {
      render(<SectionWebsites locale="fr" />);

      const [site] = frWebsites.items;
      const card = screen.getByRole("article", { name: site.title });
      const details = within(card).getByText(frWebsites.disclosureLabel).closest("details");
      expect(details).not.toHaveAttribute("open");
      site.highlights.forEach((highlight) => {
        expect(within(card).getByText(highlight)).toBeInTheDocument();
      });
    });

    it("renders the desktop and mobile captures with their localized alt text", () => {
      render(<SectionWebsites locale="fr" />);

      frWebsites.items.forEach((site) => {
        expect(screen.getByAltText(site.media.desktop.alt)).toHaveAttribute(
          "src",
          site.media.desktop.src
        );
        expect(screen.getByAltText(site.media.mobile.alt)).toHaveAttribute(
          "src",
          site.media.mobile.src
        );
      });
      screen.getAllByRole("img").forEach((image) => {
        expect(image.getAttribute("alt")?.trim()).toBeTruthy();
      });
    });

    it("closes the stack with the reserved slot, which carries no hologram", () => {
      render(<SectionWebsites locale="fr" />);

      const cards = stackCards();
      expect(cards).toHaveLength(frWebsites.items.length + 1);

      const last = cards[cards.length - 1];
      expect(last).toHaveAccessibleName(frWebsites.placeholder.title);
      expect(within(last).getByText(frWebsites.placeholder.label)).toBeVisible();
      expect(within(last).getByText(frWebsites.placeholder.text)).toBeVisible();
      expect(last).not.toHaveAttribute("data-hologram-card");
      expect(document.querySelectorAll("[data-hologram-card]")).toHaveLength(
        frWebsites.items.length
      );
    });

    it.each(["fr", "en"] as const)("tags no version number on the '%s' route", (locale) => {
      getPortfolioContent(locale).websites.items.forEach((site) => {
        site.stack.forEach((tag) => expect(tag).not.toMatch(/\d/));
      });
    });

    it("shows no position counter on the cards", () => {
      const { container } = render(<SectionWebsites locale="fr" />);

      expect(container.textContent).not.toMatch(/\b0?\d+\s*\/\s*0?\d+\b/);
    });

    it("offsets each card's sticky top by its rank", () => {
      render(<SectionWebsites locale="fr" />);

      const stack = stackCards()[0].parentElement as HTMLElement;
      expect(stack.style.getPropertyValue("--stack-top")).toBe(`${STACK_TOP_PX}px`);
      expect(stack.style.getPropertyValue("--stack-step")).toBe(`${STACK_STEP_PX}px`);
      stackCards().forEach((card, index) => {
        expect(card.style.getPropertyValue("--i")).toBe(String(index));
      });
    });

    it("stays in parity on the English route", () => {
      const enWebsites = getPortfolioContent("en").websites;
      render(<SectionWebsites locale="en" />);

      expect(screen.getByRole("heading", { level: 2, name: enWebsites.title })).toBeVisible();
      enWebsites.items.forEach((site) => {
        expect(screen.getByText(`${site.kind} · ${site.year}`)).toBeVisible();
        expect(screen.getByText(site.outcome)).toBeVisible();
        expect(screen.getByAltText(site.media.desktop.alt)).toBeInTheDocument();
      });
      expect(screen.getByText(enWebsites.placeholder.title)).toBeVisible();
    });
  });

  describe("external links", () => {
    beforeEach(() => mockMatchMedia(FINE_POINTER));

    it("links each site over https in a new tab, with a localized label", () => {
      render(<SectionWebsites locale="fr" />);

      frWebsites.items.forEach((site) => {
        const link = screen.getByRole("link", {
          name: frWebsites.externalLinkAriaTemplate.replace("{title}", site.title),
        });
        expect(link).toHaveAttribute("href", site.url);
        expect(site.url).toMatch(/^https:\/\//);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it.each(["http://example.com", "/somewhere", "javascript:alert(1)"])(
      "keeps the card but emits no link for the non-https value %s",
      (url) => {
        const [site] = frWebsites.items;
        getPortfolioContentMock.mockReturnValue({
          ...frContent,
          websites: { ...frWebsites, items: [{ ...site, url }] },
        });

        render(<SectionWebsites locale="fr" />);

        expect(screen.getByRole("article", { name: site.title })).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
      }
    );
  });

  describe("listener binding guards", () => {
    function countBindings() {
      // Two spies: the pointer listener sits on the stack element, while jsdom
      // routes `window.addEventListener` outside EventTarget.prototype.
      const elementListeners = jest.spyOn(EventTarget.prototype, "addEventListener");
      const windowListeners = jest.spyOn(window, "addEventListener");
      render(<SectionWebsites locale="fr" />);
      const stack = stackCards()[0].parentElement;
      const scrollCalls = windowListeners.mock.calls.filter(([type]) => type === "scroll");
      return {
        pointer: elementListeners.mock.calls.filter(
          ([type], index) =>
            type === "pointermove" && elementListeners.mock.contexts[index] === stack
        ).length,
        scroll: scrollCalls.length,
        scrollOptions: scrollCalls.map(([, , options]) => options),
      };
    }

    it("binds neither pointer nor scroll listener on a coarse pointer", () => {
      mockMatchMedia(NO_PREFERENCE);

      expect(countBindings()).toMatchObject({ pointer: 0, scroll: 0 });
    });

    it("binds neither pointer nor scroll listener under prefers-reduced-motion", () => {
      mockMatchMedia(FINE_POINTER_REDUCED_MOTION);

      expect(countBindings()).toMatchObject({ pointer: 0, scroll: 0 });
    });

    it("binds one delegated pointer listener and one passive scroll listener on a fine pointer", () => {
      mockMatchMedia(FINE_POINTER);

      expect(countBindings()).toEqual({
        pointer: 1,
        scroll: 1,
        scrollOptions: [{ passive: true }],
      });
    });
  });

  describe("stack depth", () => {
    beforeEach(() => mockMatchMedia(FINE_POINTER));

    it("shrinks, dims and switches off a card as the next one covers it", () => {
      const frames = captureFrames();
      render(<SectionWebsites locale="fr" />);

      const [first, second, third] = stackCards();
      [first, second, third].forEach((card) => setOffsetHeight(card, 400));
      setTop(first, 100);
      // Second card covers half of the first; third is still far below.
      setTop(second, 300);
      setTop(third, 2000);

      flushFrames(frames);
      fireEvent.scroll(window);
      fireEvent.scroll(window);
      // A burst of scroll events is coalesced into one frame.
      expect(frames).toHaveLength(1);
      frames[0](0);

      expect(first.style.getPropertyValue("--s")).toBe("0.9750");
      expect(first.style.getPropertyValue("--b")).toBe("0.7750");
      expect(first).toHaveAttribute("data-depth");
      expect(first).toHaveAttribute("data-covered");

      // Not covered: no inline depth, no filter layer.
      expect(second.style.getPropertyValue("--s")).toBe("");
      expect(second).not.toHaveAttribute("data-depth");
      expect(second).not.toHaveAttribute("data-covered");
    });

    it("keeps a lightly covered card lit", () => {
      const frames = captureFrames();
      render(<SectionWebsites locale="fr" />);

      const [first, second] = stackCards();
      setOffsetHeight(first, 400);
      setTop(first, 100);
      // 20 % covered: below the 35 % threshold.
      setTop(second, 420);

      flushFrames(frames);
      fireEvent.scroll(window);
      frames[0](0);

      expect(first).toHaveAttribute("data-depth");
      expect(first).not.toHaveAttribute("data-covered");
    });
  });

  describe("cards taller than the viewport", () => {
    it.each([
      ["a fine pointer", FINE_POINTER],
      ["a coarse pointer", NO_PREFERENCE],
      ["prefers-reduced-motion", FINE_POINTER_REDUCED_MOTION],
    ])("leaves the stack under %s", (_label, preference) => {
      mockMatchMedia(preference);
      render(<SectionWebsites locale="fr" />);

      window.innerHeight = 800;
      const [first, second] = stackCards();
      // Room for the first card: 800 - 104 - 16 = 680px.
      setOffsetHeight(first, 700);
      setOffsetHeight(second, 500);

      fireEvent(window, new Event("resize"));

      expect(first).toHaveAttribute("data-unstuck");
      expect(second).not.toHaveAttribute("data-unstuck");

      // Back under the room (e.g. its <details> closed): sticky again.
      setOffsetHeight(first, 600);
      fireEvent(window, new Event("resize"));
      expect(first).not.toHaveAttribute("data-unstuck");
    });

    it("keeps a card in place on screen when it leaves the stack", () => {
      mockMatchMedia(FINE_POINTER);
      render(<SectionWebsites locale="fr" />);
      const scrollBy = jest.spyOn(window, "scrollBy").mockImplementation(() => undefined);

      window.innerHeight = 800;
      const [first] = stackCards();
      // Stuck at 104px; back in the flow it would sit 900px higher, off screen.
      jest
        .spyOn(first, "getBoundingClientRect")
        .mockReturnValueOnce({ top: 104 } as DOMRect)
        .mockReturnValueOnce({ top: -796 } as DOMRect);
      setOffsetHeight(first, 700);

      fireEvent(window, new Event("resize"));

      expect(first).toHaveAttribute("data-unstuck");
      expect(scrollBy).toHaveBeenCalledTimes(1);
      expect(scrollBy).toHaveBeenCalledWith({ top: -900, behavior: "instant" });

      // Nothing changes on the next measure: no further scroll.
      fireEvent(window, new Event("resize"));
      expect(scrollBy).toHaveBeenCalledTimes(1);
    });
  });

  /*
   * jsdom loads no stylesheet, so the CSS guardrails are asserted on the source,
   * as in SectionProjects.
   */
  describe("stylesheet guardrails", () => {
    it("reuses the shared hologram card with a 2.5° tilt", () => {
      expect(websiteStyles).toMatch(/\.card \{\s*@include hologram\.card;\s*\}/);
      expect(websiteStyles).toMatch(/--hologram-tilt-max: 2\.5deg;/);
    });

    it("keeps the stack depth on scale and filter, never on transform", () => {
      const depthRule = websiteStyles.match(/^\.card\[data-depth\] \{([\s\S]*?)^\}/m)?.[1];
      expect(depthRule).toMatch(/scale: var\(--s, 1\);/);
      expect(depthRule).toMatch(/filter: brightness\(var\(--b, 1\)\);/);
      expect(depthRule).not.toMatch(/transform/);
    });

    it("switches the hologram off on a covered card and unsticks a tall one", () => {
      expect(websiteStyles).toMatch(/\.card\[data-covered\] \{[^}]*transform: none;/);
      expect(websiteStyles).toMatch(
        /\.card\[data-covered\]::before,\s*\.card\[data-covered\]::after \{[^}]*opacity: 0;/
      );
      expect(websiteStyles).toMatch(/\.card\[data-unstuck\] \{[^}]*position: relative;/);
    });

    it("raises a focused card above the stack, at full size", () => {
      expect(websiteStyles).toMatch(/\.card:focus-within \{[^}]*z-index: 1;/);
      expect(websiteStyles).toMatch(
        /\.card\[data-depth\]:focus-within \{[^}]*scale: none;[^}]*filter: none;/
      );
    });

    it("strips the hologram effects from the reserved slot", () => {
      expect(websiteStyles).toMatch(
        /\.cardPlaceholder::before,\s*\.cardPlaceholder::after \{[^}]*content: none;/
      );
    });

    it("scrolls the captures and moves the phone only when motion is allowed", () => {
      const reducedMotionBlock = websiteStyles.match(
        /^@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)^\}/m
      )?.[1];
      expect(reducedMotionBlock).toMatch(/scale: none;/);
      expect(reducedMotionBlock).toMatch(/filter: none;/);

      // Every capture scroll and phone drift sits in a no-preference block.
      const outsideMotionBlocks = websiteStyles.replace(
        /^@media \(prefers-reduced-motion: no-preference\)[^{]*\{[\s\S]*?^\}/gm,
        ""
      );
      expect(outsideMotionBlocks).not.toMatch(/object-position: 50% 100%/);
      expect(outsideMotionBlocks).not.toMatch(/translate: calc\(var\(--tilt-x/);
    });

    it("never uses --color-accent for text on the dark band", () => {
      expect(websiteStyles).not.toMatch(/(^|[^-])color:\s*var\(--color-accent\)/m);
    });
  });
});
