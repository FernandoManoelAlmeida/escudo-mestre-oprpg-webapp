"use client";

import Link from "next/link";
import { Header as HeaderStyled, HeaderTitle } from "./Header.styles";

export default function Header() {
  return (
    <HeaderStyled>
      <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
        <HeaderTitle>Escudo do Mestre</HeaderTitle>
      </Link>
    </HeaderStyled>
  );
}
