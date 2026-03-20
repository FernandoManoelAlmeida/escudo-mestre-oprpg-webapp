import { describe, it, expect } from "vitest";
import { REGRAS_CASA_RESUMO } from "./regrasCasaResumo";

describe("REGRAS_CASA_RESUMO", () => {
  it("lista itens com título e descrição", () => {
    expect(REGRAS_CASA_RESUMO.length).toBeGreaterThan(0);
    for (const item of REGRAS_CASA_RESUMO) {
      expect(item.titulo.trim().length).toBeGreaterThan(0);
      expect(item.descricao.trim().length).toBeGreaterThan(0);
    }
  });
});
