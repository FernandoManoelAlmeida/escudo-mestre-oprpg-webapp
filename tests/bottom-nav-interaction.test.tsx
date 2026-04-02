import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import BottomNav from "@/components/layout/BottomNav";
import { ThemeProvider } from "styled-components";
import { theme } from "@/lib/theme";
import { mockUsePathname } from "./setup/next-mocks";
import React from "react";

const renderWithTheme = (ui: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe("BottomNav interaction", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      ...window,
      scrollTo: vi.fn(),
    });
  });

  it("não faz scroll nem preventDefault quando clica num item inativo", () => {
    mockUsePathname.mockReturnValue("/");
    renderWithTheme(<BottomNav />);
    
    // O link de "Regras" leva para /regras. Pathname atual é /.
    const regrasLink = screen.getByRole("link", { name: /regras/i });
    
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    
    // Mocking preventDefault
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");
    
    fireEvent(regrasLink, clickEvent);
    
    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("faz scroll e preventDefault quando clica no item da mesma tela (exact match)", () => {
    mockUsePathname.mockReturnValue("/regras");
    renderWithTheme(<BottomNav />);
    
    const regrasLink = screen.getByRole("link", { name: /regras/i });
    
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");
    
    fireEvent(regrasLink, clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("faz scroll e preventDefault quando clica no item da mesma seção (sub-rota)", () => {
    mockUsePathname.mockReturnValue("/regras/glossario");
    renderWithTheme(<BottomNav />);
    
    const regrasLink = screen.getByRole("link", { name: /regras/i });
    
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");
    
    fireEvent(regrasLink, clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("Início (root) apenas faz scroll se estiver exatamente no /", () => {
    // Caso 1: está em /regras, clica em Início (/)
    mockUsePathname.mockReturnValue("/regras");
    const { rerender } = renderWithTheme(<BottomNav />);
    
    let inicioLink = screen.getByRole("link", { name: /início/i });
    let clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    let preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");
    
    fireEvent(inicioLink, clickEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
    
    // Caso 2: está em /, clica em Início (/)
    mockUsePathname.mockReturnValue("/");
    rerender(
      <ThemeProvider theme={theme}>
        <BottomNav />
      </ThemeProvider>
    );
    
    inicioLink = screen.getByRole("link", { name: /início/i });
    clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");
    
    fireEvent(inicioLink, clickEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
