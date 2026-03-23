import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("app/layout RootLayout", () => {
  it("renderiza children e script de --header-height", () => {
    render(
      <RootLayout>
        <div data-testid="child">página</div>
      </RootLayout>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("página");
    const inline = document.querySelector("script");
    expect(inline?.innerHTML).toContain("--header-height");
    expect(inline?.innerHTML).toContain("48px");
  });
});
