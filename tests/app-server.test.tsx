import { describe, it, expect } from "vitest";
import { metadata, viewport } from "@/app/layout";
import { generateStaticParams as genAmeacasParams } from "@/app/ameacas/[id]/page";
import { generateStaticParams as genRegrasSectionParams } from "@/app/regras/[sectionId]/page";
import AmeacaDetailPage from "@/app/ameacas/[id]/page";
import RegrasSectionPage from "@/app/regras/[sectionId]/page";
import { renderWithTheme } from "./utils/render-theme";
import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { escudoFixture } from "./fixtures/escudo-data";

describe("app router server exports", () => {
  it("layout metadata e viewport", () => {
    expect(metadata.title).toBeTruthy();
    expect(viewport.themeColor).toBe("#0e1419");
  });

  it("generateStaticParams ameaças retorna ids do JSON", async () => {
    const params = await genAmeacasParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params[0]).toHaveProperty("id");
  });

  it("generateStaticParams regras retorna sectionId", async () => {
    const params = await genRegrasSectionParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params[0]).toHaveProperty("sectionId");
  });

  it("AmeacaDetailPage async renderiza cliente", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          ameacas: [
            {
              id: "x",
              nome: "X",
              vd: 1,
              caracteristicas: ["T"],
              defesa: 1,
              pv: 1,
              atributos: { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 },
              deslocamento: "1m",
              habilidades: [],
              acoes: [],
            },
          ],
        }),
        text: async () => "",
      })) as typeof fetch,
    );
    const ui = await AmeacaDetailPage({ params: Promise.resolve({ id: "x" }) });
    renderWithTheme(ui, { withToast: true });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "X" })).toBeInTheDocument();
    });
  });

  it("RegrasSectionPage async renderiza cliente", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => escudoFixture,
        text: async () => "",
      })) as typeof fetch,
    );
    const ui = await RegrasSectionPage({ params: Promise.resolve({ sectionId: "1" }) });
    renderWithTheme(ui);
    await waitFor(() => {
      expect(screen.getByText(/Mecânica básica/i)).toBeInTheDocument();
    });
  });
});
