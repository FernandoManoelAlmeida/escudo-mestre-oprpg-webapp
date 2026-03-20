import type { AmeacasData, Ameaca } from "@/lib/ameacas";

export const ameacaMinimal: Ameaca = {
  id: "teste-ameaca",
  nome: "Criatura Teste",
  vd: 10,
  caracteristicas: ["MEDO", "CRIATURA"],
  defesa: 15,
  pv: 20,
  atributos: { AGI: 2, FOR: 2, INT: 1, PRE: 1, VIG: 2 },
  deslocamento: "9m",
  habilidades: [],
  acoes: [],
};

export const ameacasFixture: AmeacasData = {
  ameacas: [ameacaMinimal],
  caracteristicasUnicas: ["MEDO", "CRIATURA"],
};
