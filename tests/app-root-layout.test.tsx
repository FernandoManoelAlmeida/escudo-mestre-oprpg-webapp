import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import RootLayout from "@/app/layout";
import React from "react";

describe("app/layout RootLayout", () => {
  it("contém estrutura html/body e children, sem script de --header-height", () => {
    const html = renderToString(
      <RootLayout>
        <div data-testid="child">página</div>
      </RootLayout>,
    );

    // Verifica se os filhos estão presentes
    expect(html).toContain("página");

    // Sem header global: nenhum script inline de --header-height
    expect(html).not.toContain("--header-height");

    // Verifica as tags básicas estruturais
    expect(html).toContain("<html");
    expect(html).toContain("<body");
  });
});
