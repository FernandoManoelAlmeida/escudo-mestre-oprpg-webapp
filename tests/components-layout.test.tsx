import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithTheme } from "./utils/render-theme";
import StyledComponentsRegistry from "@/components/layout/Registry";
import ClientLayout from "@/components/layout/ClientLayout";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import { QuickRollBar } from "@/components/layout/QuickRollBar";
import UpdateBanner from "@/components/layout/UpdateBanner";
import RollToaster from "@/components/ui/RollToaster";
import { mockUsePathname } from "./setup/next-mocks.tsx";
import React from "react";

describe("layout components", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    mockUsePathname.mockReturnValue("/");
    vi.stubGlobal(
      "localStorage",
      (() => {
        let store: Record<string, string> = {};
        return {
          getItem: (k: string) => store[k] ?? null,
          setItem: (k: string, v: string) => {
            store[k] = v;
          },
          removeItem: (k: string) => {
            delete store[k];
          },
          clear: () => {
            store = {};
          },
        };
      })(),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("Registry renderiza children", () => {
    renderWithTheme(
      <StyledComponentsRegistry>
        <span data-testid="inner">dentro</span>
      </StyledComponentsRegistry>,
    );
    expect(screen.getByTestId("inner")).toHaveTextContent("dentro");
  });

  it("ClientLayout renderiza skip link e main", () => {
    renderWithTheme(
      <ClientLayout>
        <div data-testid="page">página</div>
      </ClientLayout>,
      { withToast: true },
    );
    expect(screen.getByRole("link", { name: /pular para o conteúdo/i })).toBeInTheDocument();
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByTestId("page"));
  });

  it("BottomNav lista rotas", () => {
    mockUsePathname.mockReturnValue("/ameacas");
    renderWithTheme(<BottomNav />);
    expect(screen.getByRole("navigation", { name: /menu principal/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /ameaças/i }).length).toBeGreaterThan(0);
  });

  it("Header exibe título e barra de rolagem", async () => {
    renderWithTheme(<Header />, { withToast: true });
    expect(screen.getByRole("banner")).toBeInTheDocument();
    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText("ex: 4d8, 2d20+5");
      expect(inputs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("QuickRollBar rola fórmula válida", async () => {
    renderWithTheme(
      <>
        <QuickRollBar />
        <RollToaster />
      </>,
      { withToast: true },
    );
    const input = screen.getByRole("textbox", { name: /fórmula de dados/i });
    fireEvent.change(input, { target: { value: "2d6" } });
    const buttons = screen.getAllByRole("button", { name: /rolar dados/i });
    fireEvent.click(buttons[0]!);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /total \d+/i })).toBeInTheDocument();
    });
  });

  it("UpdateBanner pode aparecer quando buildId difere", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | Request) => {
        const u = typeof url === "string" ? url : url.url;
        if (String(u).includes("version.json")) {
          return {
            ok: true,
            json: async () => ({ buildId: "servidor-xyz" }),
            text: async () => "",
          };
        }
        return { ok: true, json: async () => ({}), text: async () => "" };
      }) as typeof fetch,
    );
    localStorage.setItem("app-version", "local-antigo");
    renderWithTheme(<UpdateBanner />);
    await waitFor(
      () => {
        expect(screen.getByRole("button", { name: /recarregar/i })).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
