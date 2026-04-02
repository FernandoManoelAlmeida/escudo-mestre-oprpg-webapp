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

  it("contém a regra 'Ataque especial nerfado' com texto correto", () => {
    const r = REGRAS_CASA_RESUMO.find((i) => i.titulo.includes("Ataque especial"));
    expect(r).toBeDefined();
    expect(r!.descricao).toContain("Combatente");
    expect(r!.descricao).toContain("+2, +4 e +6");
  });
});
