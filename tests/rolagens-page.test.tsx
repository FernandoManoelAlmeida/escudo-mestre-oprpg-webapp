import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import RolagensPage from "@/app/rolagens/page";
import { renderWithTheme } from "./utils/render-theme";

describe("RolagensPage", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rolagem livre mostra resultado", async () => {
    renderWithTheme(<RolagensPage />);
    fireEvent.change(screen.getByRole("textbox", { name: /fórmula de dados/i }), {
      target: { value: "1d20" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^rolar dados$/i }));
    await waitFor(() => {
      expect(screen.getByText("[9] = 9")).toBeInTheDocument();
    });
  });

  it("fórmula inválida mostra aviso", () => {
    renderWithTheme(<RolagensPage />);
    fireEvent.change(screen.getByRole("textbox", { name: /fórmula de dados/i }), {
      target: { value: "não-é-fórmula" },
    });
    expect(screen.getByText(/Fórmula inválida/i)).toBeInTheDocument();
  });

  it("teste de atributo com DT mostra sucesso ou falha", async () => {
    renderWithTheme(<RolagensPage />);
    const dtInputs = screen.getAllByLabelText(/^dt$/i);
    fireEvent.change(dtInputs[0]!, { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: /rolar teste de atributo/i }));
    await waitFor(() => {
      const ok = screen.queryByText(/Sucesso|Falha/);
      expect(ok).toBeInTheDocument();
    });
  });

  it("teste de perícia altera bônus e rola", async () => {
    renderWithTheme(<RolagensPage />);
    const bonusSelect = screen.getByRole("combobox", { name: /grau de treinamento/i });
    fireEvent.change(bonusSelect, { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /rolar teste de perícia/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/\d+/).length).toBeGreaterThan(3);
    });
  });
});
