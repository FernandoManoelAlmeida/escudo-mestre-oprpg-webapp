import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("app/layout RootLayout", () => {
  it("renderiza children e script de --header-height", () => {
    // Para evitar o aviso "<html> cannot be a child of <div>", 
    // renderizamos o layout diretamente no document para simular o comportamento real.
    render(
      <RootLayout>
        <div data-testid="child">página</div>
      </RootLayout>,
      { container: document.documentElement }
    );
    expect(screen.getByTestId("child")).toHaveTextContent("página");
    const scripts = Array.from(document.querySelectorAll("script"));
    const inline = scripts.find(s => s.innerHTML.includes("--header-height"));
    expect(inline?.innerHTML).toContain("--header-height");
    expect(inline?.innerHTML).toContain("48px");
  });
});
