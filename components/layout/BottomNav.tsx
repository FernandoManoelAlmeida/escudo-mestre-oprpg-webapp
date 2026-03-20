"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { RasterIconName } from "@/lib/rasterIcons";
import {
  Nav,
  NavLink,
  NavIcon,
  NavItemWrap,
  CentralButtonWrap,
  CentralButtonIcon,
} from "./BottomNav.styles";

const items: { href: string; label: string; iconName: RasterIconName }[] = [
  { href: "/regras", label: "Regras", iconName: "regras-icon" },
  { href: "/", label: "Início", iconName: "home-icon" },
  { href: "/ameacas", label: "Ameaças", iconName: "ameacas-icon" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <Nav role="navigation" aria-label="Menu principal">
      {items.map(({ href, label, iconName }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        const isCentral = href === "/";

        if (isCentral) {
          return (
            <Link key={href} href={href} aria-label={label}>
              <NavItemWrap>
                <CentralButtonWrap>
                  <CentralButtonIcon name={iconName} alt={label} />
                </CentralButtonWrap>
              </NavItemWrap>
            </Link>
          );
        }

        return (
          <Link key={href} href={href} aria-label={label}>
            <NavItemWrap>
              <NavLink as="span" $active={active}>
                <NavIcon name={iconName} alt={label} $active={active} />
              </NavLink>
            </NavItemWrap>
          </Link>
        );
      })}
    </Nav>
  );
}
