/**
 * Resumo das regras em uso na campanha (Sobrevivendo ao Horror + regras da casa).
 * Redação alinhada ao Escudo do Mestre da Casa. Fonte: OP Sangueruim.
 */
export interface RegraCasaItem {
  titulo: string;
  descricao: string;
  referencia?: string;
}

export const REGRAS_CASA_RESUMO: RegraCasaItem[] = [
  {
    titulo: "Classe Sobrevivente",
    referencia: "Suplemento p.31",
    descricao:
      "Substitui a mecânica de Mundano para personagens que nunca tiveram contato com o paranormal. Nível 0, evolução por estágios; regras completas no Escudo do Mestre da Casa (§ 9.3).",
  },
  {
    titulo: "Medo em jogo",
    referencia: "Suplemento p.88",
    descricao:
      "Regras sobre perda de PD de forma narrativa: situações de medo com DT de Vontade e dano mental; efeitos quando PD chega a 0 (tabela 2d10). \"Sabores\" de medo conforme a cena.",
  },
  {
    titulo: "Perseguições",
    referencia: "Suplemento p.91",
    descricao:
      "Sistema de ações por rodada: presas acumulam sucessos em Atletismo (DT do mestre) antes de 3 falhas; eventos (obstáculos e atalhos) e opções de sacrifício e atrapalhar.",
  },
  {
    titulo: "Furtividade",
    referencia: "Suplemento p.93",
    descricao:
      "Cena com visibilidade acumulativa; alvo descoberto ao atingir 20+. Ações comum, discreta ou chamativa; esconder-se, distrair, chamar atenção. Eventos de furtividade por rodada (d20).",
  },
  {
    titulo: "Progressão de NEX (com homebrew)",
    referencia: "Suplemento p.100",
    descricao:
      "Mestre escolhe NEX e Experiência (Nível 1 a 20) ou Evolução por Patentes — uma não funciona em paralelo com a outra. Homebrew Discernimento: NEX como exposição ao invisível; itens \"Conhecimento do Louco\" e \"Sabedoria dos Eminentes\" para alterar NEX; mecânicas para gastar NEX com mercadores.",
  },
  {
    titulo: "Jogando sem Sanidade",
    referencia: "Suplemento p.105",
    descricao:
      "Dano mental de criaturas: reduzir cada dado em um passo e dividir a quantidade de dados pela metade (arred. para cima). Medo em jogo: reduzir cada dado de dano mental em um passo.",
  },
  {
    titulo: "Ferimentos debilitantes",
    referencia: "Suplemento p.106",
    descricao:
      "Ao falhar em Fortitude contra dano massivo, em vez de ir a 0 PV o personagem sofre ferimento debilitante. Mestre escolhe o atributo que condiz com o ferimento ou rola 1d6 (1–5 = atributo; 6 = superficial). -d20 em testes do atributo; curar com Medicina DT 20 e ação de dormir.",
  },
  {
    titulo: "Evolução por Patente",
    referencia: "Suplemento p.109",
    descricao:
      "Variante de progressão por Pontos de Prestígio e patente (Recruta a Agente de elite). Limite de PD e recuperação por patente; benefícios por patente conforme Suplemento. Não se usa em paralelo com NEX e Experiência.",
  },
  {
    titulo: "Conjuração complexa (com homebrew)",
    referencia: "Suplemento p.115",
    descricao:
      "Ritual em 3 rodadas: (1) Símbolo — opcional usar materiais do elemento para bônus, com -d20 no teste de Ocultismo; (2) Componentes — consumir = +d20; acelerar etapa 2 e 3 juntas = -d20; (3) Invocar — teste DT 20 + custo em PD; falha = perde o dobro de PD (homebrew). Extrapolar o limite: somar Presença ao limite de PD para versões aprimoradas dos rituais.",
  },
  {
    titulo: "Dano médio (opcional por demanda)",
    referencia: "Suplemento p.121",
    descricao:
      "Em qualquer teste de dano, jogadores ou Mestre podem optar por usar o valor médio do dado + bônus (ex.: 1d6+1 = 4). Crítico dobra apenas o dano médio do dado, não o bônus. Anotar danos médios para agilizar; foco na narrativa do ataque.",
  },
  {
    titulo: "Coreografia de Luta",
    referencia: "Suplemento p.123",
    descricao:
      "Até três movimentos/golpes em sequência: dois golpes = ação complexa (-d20 no ataque, dano dobrado); três golpes = ação extrema (-d20d20, dano triplicado). Pode trocar dano adicional por manobra. Usável também ao ser atacado (tentativa de evitar).",
  },
  {
    titulo: "Ataque especial nerfado (homebrew)",
    descricao:
      "Na classe Combatente o bônus para teste de ataque se torna +2, +4 e +6, conforme sobe NEX (Nível), a rolagem de dano permanece na original. Todas as defesas das ameaças diminuem em 3.",
  },
  {
    titulo: "Acerto crítico automático (homebrew)",
    descricao:
      "Qualquer resultado na margem de crítico (18–20) é acerto automático, independente da Defesa do alvo. Apenas 20 natural permanece como regra base em parte das mesas; esta campanha usa crítico = acerto automático.",
  },
  {
    titulo: "Desconsiderar resistências das criaturas paranormais (homebrew)",
    descricao:
      "Para combate mais letal, desconsiderar todas as resistências a dano das criaturas paranormais. O Mestre avalia caso a caso quando a criatura parecer fraca demais.",
  },
  {
    titulo: "Interlúdio com necessidades básicas (homebrew)",
    descricao:
      "Aplicar apenas em locais isolados e sem acesso aos recursos da Ordem. Água: consumir recupera PV/PD no limite; não consumir reduz PV ou PD máximos no limite por rodada. Comida normal e nutritiva/energética conforme consumo e ação dormir. Dormir: Normal (limite de PD por rodada), Precária (metade), Confortável (dobro), Luxuosa (triplo ou mais), Péssima (1d3 de dano).",
  },
];
