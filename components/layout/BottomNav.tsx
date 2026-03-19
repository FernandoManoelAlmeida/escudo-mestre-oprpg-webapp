"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Nav, NavLink, NavIcon, NavItemWrap, Tooltip } from "./BottomNav.styles";

const items = [
  { href: "/", label: "Início", iconSrc: "/icons/home-icon.png" },
  { href: "/regras", label: "Regras", iconSrc: "/icons/regras-icon.png" },
  { href: "/ameacas", label: "Ameaças", iconSrc: "/icons/ameacas-icon.png" },
];

const TOOLTIP_VISIBLE_MS = 5000;

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
}

export default function BottomNav() {
  const pathname = usePathname();
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTooltip = useCallback(() => {
    setVisibleTooltip(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showTooltipFor = useCallback((href: string) => {
    if (!isTouchDevice()) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisibleTooltip(href);
    timeoutRef.current = setTimeout(() => {
      setVisibleTooltip(null);
      timeoutRef.current = null;
    }, TOOLTIP_VISIBLE_MS);
  }, []);

  /** No mobile: mostra o tooltip ao tocar (feedback visual); o clique em seguida navega com um único toque. */
  const handleNavTouchStart = useCallback(
    (href: string) => {
      if (!isTouchDevice()) return;
      showTooltipFor(href);
    },
    [showTooltipFor]
  );

  useEffect(() => {
    const handleOutside = (e: TouchEvent | MouseEvent) => {
      const target = e.target as Element;
      if (target.closest?.('nav[aria-label="Menu principal"]')) return;
      clearTooltip();
    };
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("click", handleOutside);
    return () => {
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("click", handleOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [clearTooltip]);

  return (
    <Nav role="navigation" aria-label="Menu principal">
      {items.map(({ href, label, iconSrc }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        const isCurrentTooltip = visibleTooltip === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            title={label}
            onTouchStart={() => handleNavTouchStart(href)}
          >
            <NavItemWrap>
              <Tooltip $visible={isCurrentTooltip}>{label}</Tooltip>
              <NavLink as="span" $active={active}>
                {iconSrc ? (
                  <NavIcon
                    src={iconSrc}
                    alt={label}
                    title={label}
                    $active={active}
                  />
                ) : (
                  label
                )}
              </NavLink>
            </NavItemWrap>
          </Link>
        );
      })}
    </Nav>
  );
}
