import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Layout } from "@/components/Layout";

describe("Layout", () => {
  it("shows the app name 'Kratos launch' in the header", () => {
    render(
      <Layout query="" onQueryChange={() => undefined}>
        <p>contenido</p>
      </Layout>,
    );

    expect(screen.getByText("Kratos launch")).toBeInTheDocument();
  });

  it("renders its children inside the main region", () => {
    render(
      <Layout query="" onQueryChange={() => undefined}>
        <p>contenido de prueba</p>
      </Layout>,
    );

    expect(screen.getByText("contenido de prueba")).toBeInTheDocument();
  });
});
