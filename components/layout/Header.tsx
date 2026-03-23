"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Header as HeaderStyled,
  HeaderTop,
  HeaderTitleWrap,
  HeaderTitle,
  DesktopRollWrap,
  MobileToggleButton,
  HeaderRoll,
} from "./Header.styles";
import { QuickRollBar } from "./QuickRollBar";

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

const HEADER_HEIGHT_COMPACT = "48px";
const HEADER_HEIGHT_EXPANDED = "124px";

/** Retorna um inteiro aleatório entre min e max (inclusive). */
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Header() {
  const [formula, setFormula] = useState("");
  const [mobileRollOpen, setMobileRollOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [useSpecialFont, setUseSpecialFont] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const mobileRollVisible = mobileRollOpen && !isDesktop;

  useEffect(() => {
    const height =
      isDesktop ? HEADER_HEIGHT_COMPACT
      : mobileRollOpen ? HEADER_HEIGHT_EXPANDED
      : HEADER_HEIGHT_COMPACT;
    document.documentElement.style.setProperty("--header-height", height);
  }, [isDesktop, mobileRollOpen]);

  // Rotina aleatória: aguarda tempo aleatório (≤120s) com fonte do sistema,
  // depois exibe a fonte especial por 3s, e repete.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleSpecialFont() {
      // Tempo aleatório entre 5s e 120s com a fonte do sistema
      const waitMs = randomBetween(5_000, 120_000);
      timeoutId = setTimeout(() => {
        setUseSpecialFont(true);
        // Mantém a fonte especial por 3 segundos
        timeoutId = setTimeout(() => {
          setUseSpecialFont(false);
          scheduleSpecialFont(); // agenda o próximo ciclo
        }, 3_000);
      }, waitMs);
    }

    scheduleSpecialFont();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <HeaderStyled $fullHeight={mobileRollVisible}>
      <HeaderTop>
        <HeaderTitleWrap>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <HeaderTitle $specialFont={useSpecialFont}>Escudo do Mestre</HeaderTitle>
          </Link>
        </HeaderTitleWrap>

        <DesktopRollWrap>
          <QuickRollBar
            formula={formula}
            onFormulaChange={setFormula}
            showHint={false}
            hintFloating
          />
        </DesktopRollWrap>

        <MobileToggleButton
          type="button"
          onClick={() => setMobileRollOpen((o) => !o)}
          aria-label={mobileRollOpen ? "Ocultar rolagem rápida" : "Abrir rolagem rápida"}
          aria-expanded={mobileRollOpen}
        >
          {mobileRollOpen ? <ChevronUp /> : <ChevronDown />}
        </MobileToggleButton>
      </HeaderTop>

      <HeaderRoll $visible={mobileRollVisible}>
        <QuickRollBar formula={formula} onFormulaChange={setFormula} />
      </HeaderRoll>
    </HeaderStyled>
  );
}
