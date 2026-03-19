"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { assetUrl } from "@/lib/basePath";
import {
  Nav,
  NavLink,
  NavIcon,
  NavItemWrap,
  CentralButtonWrap,
  CentralButtonIcon,
} from "./BottomNav.styles";

const items = [
  { href: "/regras", label: "Regras", iconSrc: assetUrl("/icons/regras-icon.png") },
  { href: "/", label: "Início", iconSrc: assetUrl("/icons/home-icon.png") },
  { href: "/ameacas", label: "Ameaças", iconSrc: assetUrl("/icons/ameacas-icon.png") },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <Nav role="navigation" aria-label="Menu principal">
      {items.map(({ href, label, iconSrc }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        const isCentral = href === "/";

        if (isCentral) {
          return (
            <Link key={href} href={href} aria-label={label}>
              <NavItemWrap>
                <CentralButtonWrap>
                  {iconSrc && (
                    <CentralButtonIcon src={iconSrc} alt={label} />
                  )}
                </CentralButtonWrap>
              </NavItemWrap>
            </Link>
          );
        }

        return (
          <Link key={href} href={href} aria-label={label}>
            <NavItemWrap>
              <NavLink as="span" $active={active}>
                {iconSrc ? (
                  <NavIcon src={iconSrc} alt={label} $active={active} />
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
