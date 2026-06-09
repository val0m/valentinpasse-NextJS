import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CookieConsentBanner } from "./cookieConsentBanner";

describe("CookieConsentBanner", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("shows the banner in French when no choice has been made", () => {
        render(<CookieConsentBanner locale="fr" />);

        expect(
            screen.getByRole("button", { name: "Accepter" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Continuer sans accepter" })
        ).toBeInTheDocument();
    });

    it("shows the banner in English when the locale is 'en'", () => {
        render(<CookieConsentBanner locale="en" />);

        expect(
            screen.getByRole("button", { name: "Accept" })
        ).toBeInTheDocument();
    });

    it("hides the banner and stores consent when accepting", () => {
        render(<CookieConsentBanner locale="fr" />);

        fireEvent.click(screen.getByRole("button", { name: "Accepter" }));

        expect(window.localStorage.getItem("ga-consent")).toBe("granted");
        expect(
            screen.queryByRole("button", { name: "Accepter" })
        ).not.toBeInTheDocument();
    });

    it("hides the banner and stores refusal when continuing without accepting", () => {
        render(<CookieConsentBanner locale="fr" />);

        fireEvent.click(
            screen.getByRole("button", { name: "Continuer sans accepter" })
        );

        expect(window.localStorage.getItem("ga-consent")).toBe("denied");
        expect(
            screen.queryByRole("button", { name: "Continuer sans accepter" })
        ).not.toBeInTheDocument();
    });

    it("does not show the banner when a choice is already stored", () => {
        window.localStorage.setItem("ga-consent", "granted");

        render(<CookieConsentBanner locale="fr" />);

        expect(
            screen.queryByRole("button", { name: "Accepter" })
        ).not.toBeInTheDocument();
    });
});
