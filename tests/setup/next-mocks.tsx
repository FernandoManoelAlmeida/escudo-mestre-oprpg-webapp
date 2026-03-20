import { vi } from "vitest";
import React from "react";

export const mockUsePathname = vi.fn(() => "/");

vi.mock("next/link", () => ({
  default ({
    children,
    href,
    ...rest
  }: {
    children?: React.ReactNode;
    href: string | Record<string, unknown>;
  } & React.ComponentProps<"a">) {
    const to = typeof href === "string" ? href : "#";
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  /** SSR hook; no-op em ambiente de teste (StyledComponentsRegistry). */
  useServerInsertedHTML: vi.fn(),
}));
